import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../config/jwt";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }
  try {
    const decoded = verifyAccessToken(token);
    // Attach user info to request for downstream use
    (req as any).user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid or expired token" });
  }
}
