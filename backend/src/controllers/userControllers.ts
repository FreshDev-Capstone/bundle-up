import { Request, Response } from "express";
import { UserModel } from "../models/User";

// Extend Express Request to include currentUser property
interface AuthenticatedRequest extends Request {
  currentUser?: {
    id: string;
    email?: string;
    role?: "admin" | "b2c" | "b2b";
  };
}

export class UserController {
  // Get current user's profile
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.currentUser?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
      const user = await UserModel.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  }

  // Update current user's profile
  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.currentUser?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
      // Only allow updating allowed fields
      const allowedFields = [
        "companyName",
        "firstName",
        "lastName",
        "email",
        "passwordHash",
        "googleId",
      ];
      const updateData: any = {};
      for (const key of allowedFields) {
        if (req.body[key] !== undefined) updateData[key] = req.body[key];
      }
      const updated = await UserModel.updateProfile(userId, updateData);
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  }

  // Deactivate (soft delete) current user's account
  static async deactivateAccount(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.currentUser?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
      const updated = await UserModel.updateProfile(userId, {
        isEmailVerified: false,
      });
      return res
        .status(200)
        .json({ success: true, message: "Account deactivated", data: updated });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  }

  // Admin: Get any user by ID
  static async getUserById(req: AuthenticatedRequest, res: Response) {
    try {
      if (req.currentUser?.role !== "admin") {
        return res.status(403).json({ success: false, error: "Forbidden" });
      }
      const { id } = req.params;
      const user = await UserModel.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  }

  // Admin: List all users (optionally filter by role)
  static async getAllUsers(req: AuthenticatedRequest, res: Response) {
    try {
      if (req.currentUser?.role !== "admin") {
        return res.status(403).json({ success: false, error: "Forbidden" });
      }
      const { role } = req.query;
      let users;
      if (role && typeof role === "string") {
        users = await UserModel.getUsersByRole(role as "admin" | "b2c" | "b2b");
      } else {
        users = await UserModel.getAll();
      }
      return res.status(200).json({ success: true, data: users });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  }

  // Admin: Create a new user
  static async createUser(req: AuthenticatedRequest, res: Response) {
    try {
      if (req.currentUser?.role !== "admin") {
        return res.status(403).json({ success: false, error: "Forbidden" });
      }
      const user = await UserModel.create(req.body);
      return res.status(201).json({ success: true, data: user });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  }

  // Admin: Update any user by ID
  static async updateUser(req: AuthenticatedRequest, res: Response) {
    try {
      if (req.currentUser?.role !== "admin") {
        return res.status(403).json({ success: false, error: "Forbidden" });
      }
      const { id } = req.params;
      const updated = await UserModel.updateProfile(id, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  }

  // Admin: Permanently delete a user
  static async deleteUser(req: AuthenticatedRequest, res: Response) {
    try {
      if (req.currentUser?.role !== "admin") {
        return res.status(403).json({ success: false, error: "Forbidden" });
      }
      const { id } = req.params;
      const deleted = await UserModel.delete(id);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }
      return res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  }
}
