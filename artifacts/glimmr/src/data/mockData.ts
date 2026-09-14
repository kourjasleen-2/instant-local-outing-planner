import type { PlannerRequest } from '@/types/glimmr';

export { places, serviceAreas } from '@/data/places';

export const defaultRequest: PlannerRequest = {
  from: 'Indiranagar',
  to: 'Church Street',
  availableMinutes: 180,
  // ₹500 (the old placeholder-data default) makes literally every generated
  // plan infeasible against real Indiranagar prices researched for the seed
  // data (a sit-down dinner alone can run ₹500-900/person) -- confirmed by
  // actually running the engine, not assumed. ₹700 keeps "Best value"
  // comfortably feasible on first load while still honestly showing the
  // feasibility-warning UX on pricier combinations, instead of hiding it.
  budget: 700,
  people: 4,
  transport: 'transit',
  outingType: 'Food crawl',
  preference: 'Good food, somewhere peaceful, and nice for photos.',
};
