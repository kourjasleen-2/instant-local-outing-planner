export function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (!hours) return `${remainingMinutes} min`;
  if (!remainingMinutes) return `${hours} hr${hours === 1 ? '' : 's'}`;
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Representative per-person price for a Place, for display and for the
 * recommendation engine's budget-fit scoring. MVP assumption: every seeded
 * place uses per_person or flat pricing (no per_group places yet), so the
 * midpoint of priceMin/priceMax is a fair single number to show and compare.
 * Revisit this once per_group places exist — a group total shouldn't be
 * divided by nobody.
 */
export function placePrice(place: { priceMin: number; priceMax: number }) {
  return Math.round((place.priceMin + place.priceMax) / 2);
}
