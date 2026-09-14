import type { NextFunction, Request, Response } from "express";
import { supabase } from "../lib/supabase";
export interface AuthenticatedRequest extends Request { user?: { id: string; email?: string } }
export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.header("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "Missing authorization header" });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: "Invalid or expired token" });
  req.user = { id: data.user.id, email: data.user.email }; next();
}
