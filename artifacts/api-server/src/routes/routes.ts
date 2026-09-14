import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.middleware";
import { getRoute } from "../services/routing.service";

const router = Router();
const routeInput = z.object({
  mode: z.enum(["walk", "bike", "transit", "drive"]),
  coordinates: z.array(z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) })).min(2).max(6),
});

router.post("/routes", requireAuth, async (req, res) => {
  const parsed = routeInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid route coordinates" });
  const route = await getRoute(parsed.data.coordinates, parsed.data.mode);
  if (!route) return res.status(503).json({ error: "Live routing is temporarily unavailable" });
  res.json(route);
});

export default router;
