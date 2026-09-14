import { db, outingEvents } from "@glimmr/db";
import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.middleware";
const router=Router(); const event=z.object({eventType:z.enum(["plan_viewed","plan_selected","stop_swapped","stop_removed","outing_started","stop_completed","outing_abandoned","favorite"]),planId:z.string().uuid().optional(),outingId:z.string().uuid().optional(),payload:z.record(z.string(),z.unknown()).default({})});
router.post("/events",requireAuth,async(req:AuthenticatedRequest,res)=>{const parsed=event.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Invalid event"});await db.insert(outingEvents).values({...parsed.data,userId:req.user!.id});res.status(204).end();}); export default router;
