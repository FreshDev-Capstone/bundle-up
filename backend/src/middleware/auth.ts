import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { verifyAccessToken, JWTPayload } from "../config/jwt";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "admin" | "b2c" | "b2b";
  };
}

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: "admin" | "b2c" | "b2b";
};

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Access token required" });
      return;
    }

    // Use the proper JWT verification from config
    const decoded = verifyAccessToken(token);

    // Verify the token is an access token
    if (decoded.type !== "access") {
      res.status(401).json({ error: "Invalid token type" });
      return;
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const requireRole = (allowedRoles: Array<"admin" | "b2c" | "b2b">) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as AuthenticatedUser | undefined;
    if (!user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(["admin"]);
export const requireB2C = requireRole(["b2c"]);
export const requireB2B = requireRole(["b2b"]);
export const requireB2CAnyRole = requireRole(["b2c", "b2b"]);
export const checkAuthentication = authenticateToken;
