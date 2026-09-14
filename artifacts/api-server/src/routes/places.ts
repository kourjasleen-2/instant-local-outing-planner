import { and, asc, eq, ilike } from "drizzle-orm";
import { db, places } from "@glimmr/db";
import { Router } from "express";
const router = Router();
router.get("/places", async (req, res) => { const limit = Math.min(Number(req.query.limit) || 50, 100); const filters = [eq(places.active, true)]; if (typeof req.query.category === "string") filters.push(eq(places.category, req.query.category)); if (typeof req.query.area === "string") filters.push(eq(places.serviceArea, req.query.area)); if (typeof req.query.q === "string") filters.push(ilike(places.name, `%${req.query.q}%`)); const items = await db.select().from(places).where(and(...filters)).orderBy(asc(places.name)).limit(limit); res.json({ items, limit }); });
router.get("/places/:id", async (req, res) => { const [place] = await db.select().from(places).where(and(eq(places.id, req.params.id), eq(places.active, true))); if (!place) return res.status(404).json({ error: "Place not found" }); res.json(place); });
export default router;
