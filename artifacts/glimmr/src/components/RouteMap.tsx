import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Plan, PlanStep } from "@/types/glimmr";
import { apiFetch } from "@/lib/api";

type RouteResponse = { distanceKm: number; durationMinutes: number; geometry: { type: "LineString"; coordinates: [number, number][] } };
const toLeaflet = (geometry: RouteResponse["geometry"]) => geometry.coordinates.map(([lng, lat]) => [lat, lng] as L.LatLngTuple);
const distanceMetres = (a: L.LatLngTuple, b: L.LatLngTuple) => L.latLng(a).distanceTo(L.latLng(b));

export function RouteMap({ plan, currentStop }: { plan: Plan; currentStop: PlanStep }) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!element.current) return;
    const map = L.map(element.current, { zoomControl: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors" }).addTo(map);
    const stopPoints = plan.steps.map((step) => [step.place.lat, step.place.lng] as L.LatLngTuple);
    stopPoints.forEach((point, index) => L.circleMarker(point, { radius: 9, color: "#ffffff", weight: 2, fillColor: "#2563eb", fillOpacity: 1 }).addTo(map).bindPopup(`${index + 1}. ${plan.steps[index].place.name}`));
    map.fitBounds(L.latLngBounds(stopPoints), { padding: [36, 36], maxZoom: 15 });

    let plannedLine: L.Polyline | undefined;
    let liveLine: L.Polyline | undefined;
    let locationMarker: L.CircleMarker | undefined;
    let lastPosition: L.LatLngTuple | undefined;
    let lastRouteAt = 0;
    let cancelled = false;
    const mode = plan.request.transport;
    const drawRoute = async (points: L.LatLngTuple[], kind: "planned" | "live") => {
      try {
        const route = await apiFetch<RouteResponse>("/routes", { method: "POST", body: JSON.stringify({ mode, coordinates: points.map(([lat, lng]) => ({ lat, lng })) }) });
        if (cancelled) return;
        const line = L.polyline(toLeaflet(route.geometry), kind === "live" ? { color: "#2563eb", weight: 5, opacity: 0.95 } : { color: "#94a3b8", weight: 3, opacity: 0.65, dashArray: "7 8" }).addTo(map);
        if (kind === "live") { liveLine?.remove(); liveLine = line; } else { plannedLine?.remove(); plannedLine = line; }
      } catch {
        // Keep markers available if the public routing service is busy.
      }
    };
    void drawRoute(stopPoints, "planned");
    const watch = navigator.geolocation?.watchPosition((position) => {
      const point: L.LatLngTuple = [position.coords.latitude, position.coords.longitude];
      if (locationMarker) locationMarker.setLatLng(point); else locationMarker = L.circleMarker(point, { radius: 8, color: "#ffffff", weight: 3, fillColor: "#f59e0b", fillOpacity: 1 }).addTo(map).bindPopup("You are here");
      const shouldReroute = !lastPosition || distanceMetres(point, lastPosition) >= 30 || Date.now() - lastRouteAt > 20000;
      if (shouldReroute) { lastPosition = point; lastRouteAt = Date.now(); void drawRoute([point, [currentStop.place.lat, currentStop.place.lng]], "live"); }
    }, () => undefined, { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 });
    return () => { cancelled = true; if (watch !== undefined) navigator.geolocation.clearWatch(watch); map.remove(); };
  }, [plan, currentStop]);
  return <div ref={element} style={{ width: "100%", height: "100%", minHeight: 360, borderRadius: 16 }} aria-label="Live route map" />;
}
