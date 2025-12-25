import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: { id: string; email?: string; [k: string]: any };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return next();
}
