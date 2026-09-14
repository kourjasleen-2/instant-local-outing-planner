import type { InferSelectModel } from "drizzle-orm";
import type { places } from "@glimmr/db/schema";
export type Place = InferSelectModel<typeof places>;
export type PlannerInput = { from: string; to: string; availableMinutes: number; budget: number; people: number; transport: "walk" | "bike" | "transit" | "drive"; outingType: string; preference?: string; latitude?: number; longitude?: number };
const tags: Record<string, string[]> = { "Food crawl": ["food"], "Low-key day": ["peaceful", "chill"], "Date night": ["drinks", "photography"], "Arts & culture": ["culture", "art"], "Fresh air": ["outdoor", "active"] };
export const km = (a: Place, b: Place) => { const d = Math.PI / 180, x = (b.lat - a.lat) * d, y = (b.lng - a.lng) * d; return 6371 * 2 * Math.asin(Math.sqrt(Math.sin(x / 2) ** 2 + Math.cos(a.lat * d) * Math.cos(b.lat * d) * Math.sin(y / 2) ** 2)); };
const travel = (distance: number, mode: PlannerInput["transport"]) => Math.max(3, Math.round(distance / ({ walk: 4.5, bike: 12, transit: 16, drive: 20 }[mode]) * 60));
export function recommend(input: PlannerInput, source: Place[]) {
  const wanted = [...(tags[input.outingType] ?? []), ...(input.preference?.toLowerCase().match(/food|coffee|peaceful|photo|outdoor|drinks|culture|active/g) ?? [])];
  const ranked = source.filter((p) => p.priceMin <= input.budget).sort((a, b) => ((b.activities.filter(x => wanted.includes(x)).length * 4 + b.experienceScore) - (a.activities.filter(x => wanted.includes(x)).length * 4 + a.experienceScore)));
  const variants = [ranked, [...ranked].sort((a,b) => a.priceMin-b.priceMin), [...ranked].sort((a,b) => b.rating-a.rating)];
  return variants.map((options, i) => { const stops: Place[] = []; for (const p of options) { if (stops.length === 3) break; const candidate = [...stops, p]; const duration = candidate.reduce((n,x)=>n+x.typicalVisitDuration,0) + candidate.slice(1).reduce((n,x,j)=>n+travel(km(candidate[j],x),input.transport),0); if (duration <= input.availableMinutes) stops.push(p); } return { stops, label: ["Best fit", "Best value", "Highest rated"][i], reasons: i === 1 ? ["Keeps more room in your budget"] : i === 2 ? ["Prioritises well-rated stops"] : ["Matches your time, budget, and mood"] }; }).filter(x => x.stops.length > 0);
}
