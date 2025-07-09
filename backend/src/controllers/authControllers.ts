import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, CreateUserData } from "../models/User";
import { jwtConfig } from "../config/jwt";
import {
  sendSuccess,
  sendError,
  sendInternalError,
  sendValidationError,
  sendAuthError,
  sendNotFoundError,
  sendConflictError,
} from "../utils/responseHelpers";
import {
  validateRequiredFields,
  validateEmail,
  validatePassword,
} from "../utils/validationHelpers";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "admin" | "b2c" | "b2b";
  };
}

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, companyName } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        return sendValidationError(res, "All fields are required");
      }

      // Validate email format
      if (!validateEmail(email)) {
        return sendValidationError(res, "Invalid email format");
      }

      // Validate password strength
      if (!validatePassword(password)) {
        return sendValidationError(
          res,
          "Password must be at least 8 characters long"
        );
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return sendConflictError(res, "User already exists");
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Determine user role based on email and company name
      const isAdmin = await User.isAdminEmail(email);
      const role: "admin" | "b2c" | "b2b" = isAdmin
        ? "admin"
        : companyName
        ? "b2b"
        : "b2c";

      // Create user
      const userData: CreateUserData = {
        email,
        firstName,
        lastName,
        companyName, // Include company name if provided
        passwordHash,
        role,
        isEmailVerified: false,
      };

      const user = await User.create(userData);

      // Generate JWT token
      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
      const token = jwt.sign(payload, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
      } as any);

      // Remove sensitive data from response
      const { passwordHash: _, ...userResponse } = user;

      return sendSuccess(
        res,
        {
          user: userResponse,
          token,
        },
        201
      );
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return sendValidationError(res, "Email and password are required");
      }

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return sendAuthError(res, "Invalid credentials");
      }

      // Check if user has password (Google-only users won't have password)
      if (!user.passwordHash) {
        return sendAuthError(res, "Invalid credentials");
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return sendAuthError(res, "Invalid credentials");
      }

      // Update last login
      await User.updateLastLogin(user.id);

      // Generate JWT token
      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
      const token = jwt.sign(payload, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
      } as any);

      // Remove sensitive data from response
      const { passwordHash: _, ...userResponse } = user;

      return sendSuccess(res, {
        user: userResponse,
        token,
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  static async googleAuth(req: Request, res: Response) {
    try {
      const { googleId, email, firstName, lastName } = req.body;

      // Validate required fields
      if (!googleId || !email || !firstName || !lastName) {
        return sendValidationError(res, "All Google OAuth fields are required");
      }

      // Validate email format
      if (!validateEmail(email)) {
        return sendValidationError(res, "Invalid email format");
      }

      // Check if user exists by Google ID
      let user = await User.findByGoogleId(googleId);

      if (!user) {
        // Check if user exists by email
        user = await User.findByEmail(email);

        if (user) {
          // Update existing user with Google ID
          user = await User.updateProfile(user.id, { googleId });
        } else {
          // Create new user
          const isAdmin = await User.isAdminEmail(email);
          const role: "admin" | "b2c" | "b2b" = isAdmin ? "admin" : "b2c";

          const userData: CreateUserData = {
            email,
            firstName,
            lastName,
            role,
            googleId,
            isEmailVerified: true, // Google emails are pre-verified
          };

          user = await User.create(userData);
        }
      }

      // Update last login
      await User.updateLastLogin(user.id);

      // Generate JWT token
      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
      const token = jwt.sign(payload, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
      } as any);

      // Remove sensitive data from response
      const { passwordHash: _, ...userResponse } = user;

      return sendSuccess(res, {
        user: userResponse,
        token,
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const user = req.user as
        | { id: string; email: string; role: string }
        | undefined;

      if (!user) {
        return sendAuthError(res, "User not authenticated");
      }

      const fullUser = await User.findById(user.id);

      if (!fullUser) {
        return sendNotFoundError(res, "User not found");
      }

      // Remove sensitive data from response
      const { passwordHash: _, ...userResponse } = fullUser;

      return sendSuccess(res, {
        user: userResponse,
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const authenticatedUser = req.user as
        | { id: string; email: string; role: string }
        | undefined;

      if (!authenticatedUser) {
        return sendAuthError(res, "User not authenticated");
      }

      const { firstName, lastName } = req.body;

      // Validate required fields
      if (!firstName || !lastName) {
        return sendValidationError(
          res,
          "First name and last name are required"
        );
      }

      const user = await User.findById(authenticatedUser.id);

      if (!user) {
        return sendNotFoundError(res, "User not found");
      }

      // Update user profile
      const updatedUser = await User.updateProfile(authenticatedUser.id, {
        firstName,
        lastName,
      });

      // Remove sensitive data from response
      const { passwordHash: _, ...userResponse } = updatedUser;

      return sendSuccess(res, {
        user: userResponse,
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const authenticatedUser = req.user as
        | { id: string; email: string; role: string }
        | undefined;

      if (!authenticatedUser) {
        return sendAuthError(res, "User not authenticated");
      }

      const { currentPassword, newPassword } = req.body;

      // Validate required fields
      if (!currentPassword || !newPassword) {
        return sendValidationError(
          res,
          "Current password and new password are required"
        );
      }

      // Validate new password strength
      if (!validatePassword(newPassword)) {
        return sendValidationError(
          res,
          "New password must be at least 8 characters long"
        );
      }

      const user = await User.findById(authenticatedUser.id);

      if (!user) {
        return sendNotFoundError(res, "User not found");
      }

      // Check if user has password (Google-only users won't have password)
      if (!user.passwordHash) {
        return sendAuthError(
          res,
          "Cannot change password for Google-only accounts"
        );
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );
      if (!isCurrentPasswordValid) {
        return sendAuthError(res, "Current password is incorrect");
      }

      // Hash new password
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await User.updateProfile(authenticatedUser.id, {
        passwordHash: newPasswordHash,
      });

      return sendSuccess(res, {
        message: "Password changed successfully",
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  static async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return sendValidationError(res, "Verification token is required");
      }

      // Verify token and extract user ID
      const decoded = jwt.verify(token, jwtConfig.secret) as { userId: string };
      const userId = decoded.userId;

      const user = await User.findById(userId);

      if (!user) {
        return sendNotFoundError(res, "User not found");
      }

      if (user.isEmailVerified) {
        return sendError(res, "Email is already verified", 400);
      }

      // Mark email as verified
      await User.verifyEmail(userId);

      return sendSuccess(res, {
        message: "Email verified successfully",
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return sendValidationError(res, "Invalid verification token");
      }

      return sendInternalError(res, error as Error);
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const authenticatedUser = req.user as
        | { id: string; email: string; role: string }
        | undefined;

      if (!authenticatedUser) {
        return sendAuthError(res, "User not authenticated");
      }

      const user = await User.findById(authenticatedUser.id);

      if (!user) {
        return sendNotFoundError(res, "User not found");
      }

      // Generate new JWT token
      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
      const token = jwt.sign(payload, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
      } as any);

      return sendSuccess(res, {
        token,
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }
}
