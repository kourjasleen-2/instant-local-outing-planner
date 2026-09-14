import type { OutingType, Place, Plan, PlannerRequest, PlanStep, TransportMode } from '@/types/glimmr';
import { placePrice, formatINR } from '@/lib/glimmr-format';
import { serviceAreas } from '@/data/places';

/**
 * ============================================================================
 * GLIMMR recommendation engine
 * ============================================================================
 * Deterministic and explainable by design (vision Section 11): same request
 * + same data always produces the same plans, and every plan carries the
 * reasons it was picked. This file is the one place scoring weights live —
 * they are hypotheses, meant to be tuned, not scattered through the app.
 *
 * Responsibility boundary (vision Section 17): this module answers "which
 * combination fits the user" using facts it's given. It never invents a
 * place, price, or opening hour — those come from data/places.ts. Distance
 * is approximated with straight-line geometry (see estimateTravel below)
 * as an explicit, isolated stand-in for a real maps-service (Phase 3);
 * swapping in a real routing API later means changing that one function.
 * ============================================================================
 */

export const scoringWeights = {
  budgetFit: 0.25,
  preferenceMatch: 0.25,
  experienceQuality: 0.2,
  groupFit: 0.15,
  activityFit: 0.15,
};

const OUTING_TYPE_TAGS: Record<OutingType, string[]> = {
  'Food crawl': ['food'],
  'Low-key day': ['peaceful', 'chill'],
  'Date night': ['drinks', 'photography'],
  'Arts & culture': ['culture', 'art'],
  'Fresh air': ['outdoor', 'active'],
};

// Standing in for the NLP layer (vision Section 4/7): free text in, tags
// out. This never returns anything but tags — it cannot represent a place,
// price, or plan, which is what keeps the AI/data boundary real rather than
// aspirational once a real LLM call replaces this keyword match.
const PREFERENCE_TAG_KEYWORDS: Record<string, string[]> = {
  peaceful: ['peaceful', 'quiet', 'calm', 'chill'],
  food: ['food', 'eat', 'dinner', 'lunch', 'breakfast', 'hungry', 'meal'],
  photography: ['photo', 'instagram', 'pictures', 'aesthetic'],
  coffee: ['coffee', 'cafe', 'caffeine'],
  outdoor: ['outdoor', 'park', 'fresh air', 'walk', 'outside'],
  drinks: ['drink', 'beer', 'cocktail', 'bar', 'wine'],
  culture: ['art', 'theatre', 'culture', 'museum', 'poetry'],
  active: ['active', 'adventure', 'sport', 'climb'],
};

export function parsePreferenceTags(preference?: string): string[] {
  if (!preference) return [];
  const text = preference.toLowerCase();
  return Object.entries(PREFERENCE_TAG_KEYWORDS)
    .filter(([, keywords]) => keywords.some((keyword) => text.includes(keyword)))
    .map(([tag]) => tag);
}

// Rough planning speeds (km/h), not live traffic data — a deliberate,
// isolated approximation. See module header.
const TRANSPORT_SPEED_KMH: Record<TransportMode, number> = {
  walk: 4.5,
  bike: 13,
  transit: 17,
  drive: 20,
};

function haversineKm(a: Pick<Place, 'lat' | 'lng'>, b: Pick<Place, 'lat' | 'lng'>): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function estimateTravel(from: Pick<Place, 'lat' | 'lng'>, to: Pick<Place, 'lat' | 'lng'>, mode: TransportMode) {
  const distanceKm = Number(haversineKm(from, to).toFixed(1));
  const minutes = Math.max(5, Math.round((distanceKm / TRANSPORT_SPEED_KMH[mode]) * 60));
  return { distanceKm, minutes };
}

interface ScoredPlace {
  place: Place;
  score: number;
  reasons: string[];
}

function scorePlace(place: Place, request: PlannerRequest, tags: Set<string>): ScoredPlace {
  const price = placePrice(place);
  const budgetFit = price <= request.budget ? 1 : Math.max(0, 1 - (price - request.budget) / request.budget);

  const matchCount = place.activities.filter((activity) => tags.has(activity)).length;
  const preferenceMatch = tags.size ? matchCount / tags.size : 0.5;

  const experienceQuality = place.experienceScore;

  const wantsIntimate = request.people <= 2;
  const groupFit = wantsIntimate
    ? place.suitableFor.includes('couple') || place.suitableFor.includes('solo') ? 1 : 0.6
    : place.suitableFor.includes('friends') || place.suitableFor.includes('family') ? 1 : 0.6;

  const activityFit = place.activities.some((activity) => tags.has(activity)) ? 1 : 0.5;

  const score =
    budgetFit * scoringWeights.budgetFit +
    preferenceMatch * scoringWeights.preferenceMatch +
    experienceQuality * scoringWeights.experienceQuality +
    groupFit * scoringWeights.groupFit +
    activityFit * scoringWeights.activityFit;

  const reasons: string[] = [];
  if (budgetFit >= 0.85) reasons.push('Fits your budget');
  if (preferenceMatch >= 0.5) reasons.push('Matches what you asked for');
  if (experienceQuality >= 0.8) reasons.push('Highly rated experience');
  if (groupFit === 1) reasons.push('Works for your group');

  return { place, score, reasons };
}

// Category buckets used to build varied, sensible stop sequences.
// Deliberately data-driven (matched against real category strings in
// data/places.ts) rather than hardcoded per-place, so new seeded places
// slot in automatically by category.
const BUCKETS: Record<'starter' | 'main' | 'activity' | 'evening', string[]> = {
  starter: ['Cafe', 'Dessert'],
  main: ['Dinner'],
  activity: ['Activity', 'Culture', 'Outdoor'],
  evening: ['Drinks'],
};

function bucketOf(place: Place): keyof typeof BUCKETS | null {
  for (const [bucket, categories] of Object.entries(BUCKETS) as [keyof typeof BUCKETS, string[]][]) {
    if (categories.includes(place.category)) return bucket;
  }
  return null;
}

// Three distinct stop-sequence templates — this is what makes the 3 results
// meaningfully different shapes of outing, not 3 shuffles of the same idea.
// 'sort' controls how each bucket's candidates are ranked before picking:
// score-based for the general-purpose templates, price-based for the one
// explicitly promising to be the cheaper option — otherwise "Best value"
// was just another top-scored pick that happened to have fewer stops.
const PLAN_TEMPLATES: { label: string; buckets: (keyof typeof BUCKETS)[]; sort: 'score' | 'price' }[] = [
  { label: 'Best fit', buckets: ['starter', 'main', 'activity'], sort: 'score' },
  { label: 'Best value', buckets: ['starter', 'main'], sort: 'price' },
  { label: 'Most adventurous', buckets: ['activity', 'main', 'evening'], sort: 'score' },
];

const START_TIME_MINUTES = 18 * 60; // 6:00 PM, matches the existing mock's evening-outing framing

function formatOverBudget(price: number, budget: number): string {
  return formatINR(price - budget);
}

function formatClock(totalMinutes: number): string {
  const hour24 = Math.floor(totalMinutes / 60) % 24;
  const minute = totalMinutes % 60;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const suffix = hour24 >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minute.toString().padStart(2, '0')} ${suffix}`;
}

function buildSteps(sequence: Place[], request: PlannerRequest): PlanStep[] {
  const steps: PlanStep[] = [];
  let clock = START_TIME_MINUTES;
  let previous: Place | null = null;
  for (const place of sequence) {
    const travel = previous ? estimateTravel(previous, place, request.transport) : { minutes: 0, distanceKm: 0 };
    clock += travel.minutes;
    steps.push({
      id: `step-${place.id}-${steps.length}`,
      place,
      arrival: formatClock(clock),
      durationMinutes: place.typicalVisitDuration,
      travelMinutes: travel.minutes,
      distanceKm: travel.distanceKm,
    });
    clock += place.typicalVisitDuration;
    previous = place;
  }
  return steps;
}

function totalsFor(steps: PlanStep[]) {
  const pricePerPerson = steps.reduce((sum, step) => sum + placePrice(step.place), 0);
  const totalMinutes = steps.reduce((sum, step) => sum + step.durationMinutes + step.travelMinutes, 0);
  const travelMinutes = steps.reduce((sum, step) => sum + step.travelMinutes, 0);
  const totalDistanceKm = Number(steps.reduce((sum, step) => sum + step.distanceKm, 0).toFixed(1));
  return { pricePerPerson, totalMinutes, travelMinutes, totalDistanceKm };
}

function resolveServiceArea(request: PlannerRequest): string {
  const match = serviceAreas.find(
    (area) => area.active && (request.from.toLowerCase().includes(area.name.toLowerCase()) || request.to.toLowerCase().includes(area.name.toLowerCase())),
  );
  // MVP fallback: default to the first active area rather than returning no
  // candidates, since V1 only truly covers one active area today.
  return match?.id ?? serviceAreas.find((area) => area.active)?.id ?? serviceAreas[0].id;
}

export function generatePlans(request: PlannerRequest, allPlaces: Place[]): Plan[] {
  const serviceArea = resolveServiceArea(request);
  const candidates = allPlaces.filter((place) => place.serviceArea === serviceArea);

  const tags = new Set([...parsePreferenceTags(request.preference), ...OUTING_TYPE_TAGS[request.outingType]]);
  const scored = candidates
    .map((place) => scorePlace(place, request, tags))
    .sort((a, b) => b.score - a.score);

  const byBucket = new Map<keyof typeof BUCKETS, ScoredPlace[]>();
  for (const entry of scored) {
    const bucket = bucketOf(entry.place);
    if (!bucket) continue;
    if (!byBucket.has(bucket)) byBucket.set(bucket, []);
    byBucket.get(bucket)!.push(entry);
  }

  const usedPlaceIds = new Set<string>();
  const plans: Plan[] = [];

  for (const template of PLAN_TEMPLATES) {
    const chosen: ScoredPlace[] = [];
    let runningPrice = 0;
    for (const bucket of template.buckets) {
      const pool = [...(byBucket.get(bucket) ?? [])];
      if (template.sort === 'price') pool.sort((a, b) => placePrice(a.place) - placePrice(b.place));
      // Budget-aware pick: prefer the best-ranked (by this template's sort)
      // candidate that still fits what's left of the per-person budget.
      // Falls back to the top-ranked candidate regardless of price rather
      // than an empty stop — a plan that runs over budget and says so
      // (via feasibilityNote below) is more useful than a silently
      // dropped stop.
      const remaining = request.budget - runningPrice;
      const unused = pool.filter((entry) => !usedPlaceIds.has(entry.place.id));
      const withinBudget = unused.find((entry) => placePrice(entry.place) <= remaining);
      const pick = withinBudget ?? unused[0] ?? pool[0];
      if (pick) {
        chosen.push(pick);
        runningPrice += placePrice(pick.place);
      }
    }
    if (!chosen.length) continue;

    let steps = buildSteps(chosen.map((entry) => entry.place), request);
    let totals = totalsFor(steps);

    // Feasibility check (vision Section 8): if the full combination doesn't
    // fit the time window, drop the lowest-scored stop and recheck once,
    // rather than either silently ignoring the overage or discarding the
    // whole plan outright.
    if (totals.totalMinutes > request.availableMinutes && chosen.length > 2) {
      const trimmed = [...chosen].sort((a, b) => a.score - b.score).slice(1);
      const trimmedSteps = buildSteps(trimmed.map((entry) => entry.place), request);
      const trimmedTotals = totalsFor(trimmedSteps);
      if (trimmedTotals.totalMinutes <= request.availableMinutes) {
        steps = trimmedSteps;
        totals = trimmedTotals;
        chosen.length = 0;
        chosen.push(...trimmed);
      }
    }

    let feasibilityNote: string | undefined;
    if (totals.totalMinutes > request.availableMinutes) {
      feasibilityNote = `This plan runs about ${totals.totalMinutes - request.availableMinutes} min over your available time.`;
    }
    if (totals.pricePerPerson > request.budget) {
      feasibilityNote = feasibilityNote
        ? `${feasibilityNote} It's also ${formatOverBudget(totals.pricePerPerson, request.budget)} over budget per person.`
        : `This plan runs ${formatOverBudget(totals.pricePerPerson, request.budget)} over your budget per person.`;
    }

    chosen.forEach((entry) => usedPlaceIds.add(entry.place.id));

    // Reasons are computed from the FINAL combined plan, not the individual
    // per-place scores above — a place that fit the budget alone doesn't
    // mean the combination does, and a plan flagged infeasible must never
    // also claim "fits your budget" (that mismatch was a real bug caught by
    // actually running this against the seed data, not just typechecking).
    const reasons: string[] = [];
    if (totals.pricePerPerson <= request.budget) reasons.push('Fits your budget');
    if (totals.totalMinutes <= request.availableMinutes) reasons.push('Fits your time');
    if (chosen.every((entry) => entry.reasons.includes('Works for your group'))) reasons.push('Works for your group');
    const avgPreferenceMatch = chosen.reduce((sum, entry) => sum + (tags.size ? entry.place.activities.filter((a) => tags.has(a)).length / tags.size : 0), 0) / chosen.length;
    if (avgPreferenceMatch >= 0.4) reasons.push('Matches what you asked for');
    const avgExperience = chosen.reduce((sum, entry) => sum + entry.place.experienceScore, 0) / chosen.length;
    if (avgExperience >= 0.75) reasons.push('Highly rated stops');
    if (template.sort === 'price') reasons.push('Keeps spend predictable');

    plans.push({
      id: `plan-${template.label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${plans.length}`,
      title: chosen.map((entry) => entry.place.name).slice(0, 2).join(' → '),
      subtitle: chosen.map((entry) => entry.place.subcategory ?? entry.place.category).join(', '),
      vibe: chosen[0]?.place.vibe ?? '',
      totalMinutes: totals.totalMinutes,
      pricePerPerson: totals.pricePerPerson,
      groupTotal: totals.pricePerPerson * request.people,
      totalDistanceKm: totals.totalDistanceKm,
      travelMinutes: totals.travelMinutes,
      feasible: !feasibilityNote,
      feasibilityNote,
      recommendationLabel: template.label,
      recommendationReason: reasons.length ? reasons : ['A different shape of outing than the other two'],
      status: 'ready',
      steps,
      request,
    });
  }

  return plans;
}
