import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.middleware";
const router = Router();
router.get("/me", requireAuth, (req: AuthenticatedRequest, res) => res.json({ user: req.user }));
export default router;
