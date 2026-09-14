/** OSRM calculates routes; Leaflet only renders the returned geometry. */
export async function getRoute(points: Array<{ lat: number; lng: number }>, mode: "walk" | "bike" | "transit" | "drive") {
  if (points.length < 2) return null;
  // Public OSRM's hosted instance supplies road geometry. It is accurate for
  // road travel; transit and pedestrian choices retain their own itinerary ETA.
  const coordinates = points.map((p) => `${p.lng},${p.lat}`).join(";");
  try { const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`, { signal: AbortSignal.timeout(4000), headers: { "User-Agent": "glimmr-v1" } }); if (!response.ok) return null; const data = await response.json() as { routes?: Array<{ distance: number; duration: number; geometry: unknown }> }; const route = data.routes?.[0]; return route ? { distanceKm: route.distance / 1000, durationMinutes: Math.round(route.duration / 60), geometry: route.geometry, mode } : null; } catch { return null; }
}
