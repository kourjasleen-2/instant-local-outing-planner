export type TransportMode = 'walk' | 'bike' | 'transit' | 'drive';
export type OutingType = 'Food crawl' | 'Low-key day' | 'Date night' | 'Arts & culture' | 'Fresh air';
export type PlanStatus = 'idle' | 'loading' | 'ready' | 'editing' | 'adding' | 'deleting' | 'replacing' | 'regenerating' | 'recalculating' | 'success' | 'error';
export type LocationStatus = 'idle' | 'loading' | 'permission-denied' | 'unavailable' | 'searching' | 'success' | 'empty' | 'error' | 'search-success' | 'search-empty' | 'search-error' | 'selected';

export interface Location {
  label: string;
  status: LocationStatus;
  source: 'current' | 'search' | 'manual';
}

export interface TravelInfo {
  minutes: number;
  distanceKm: number;
  mode: TransportMode;
}

export interface PlannerRequest {
  from: string;
  to: string;
  availableMinutes: number;
  budget: number;
  people: number;
  transport: TransportMode;
  outingType: OutingType;
  preference?: string;
}

/**
 * Coverage limit, not a hardcoded product limitation — see /areas/glimmr.md.
 * New areas are new rows here, never new branches in the recommendation
 * engine or frontend.
 */
export interface ServiceArea {
  id: string;
  name: string;
  city: string;
  active: boolean;
}

export type PriceBasis = 'per_person' | 'per_group' | 'flat';
export type VerificationStatus = 'verified' | 'unverified' | 'ai-suggested';

export interface Place {
  id: string;
  name: string;
  serviceArea: string; // ServiceArea['id']
  category: string;
  subcategory?: string;
  address: string;
  description: string;
  lat: number;
  lng: number;
  priceMin: number;
  priceMax: number;
  priceBasis: PriceBasis;
  openingHours: string; // MVP: human-readable, e.g. "11:00 AM – 11:30 PM"
  typicalVisitDuration: number; // minutes
  suitableFor: string[]; // e.g. 'friends', 'couple', 'solo', 'family'
  activities: string[]; // tags used for preference matching, e.g. 'food', 'peaceful', 'photography'
  vibe: string;
  rating: number; // 0–5
  reviewCount: number;
  experienceScore: number; // 0–1, curated quality signal independent of raw rating
  websiteUrl?: string;
  mapsUrl?: string;
  source: string; // provenance, e.g. 'web-research-2026-09'
  verificationStatus: VerificationStatus;
  lastVerified: string; // ISO date
  confidence: number; // 0–1
}

export interface PlanStep {
  id: string;
  place: Place;
  arrival: string;
  durationMinutes: number;
  travelMinutes: number;
  distanceKm: number;
  note?: string;
}

export interface Plan {
  id: string;
  title: string;
  subtitle: string;
  vibe: string;
  totalMinutes: number;
  pricePerPerson: number;
  groupTotal: number;
  totalDistanceKm: number;
  travelMinutes: number;
  feasible: boolean;
  feasibilityNote?: string;
  recommendationLabel: string;
  recommendationReason: string[];
  status: PlanStatus;
  steps: PlanStep[];
  request: PlannerRequest;
}

export interface PlanEdit {
  type: 'replace' | 'edit' | 'delete' | 'add';
  stepId?: string;
  placeId?: string;
  changes?: Partial<PlanStep>;
  instruction?: string;
}

export interface Outing {
  id: string;
  planId: string;
  startedAt: string;
  currentStepId: string;
  completedStepIds: string[];
}
