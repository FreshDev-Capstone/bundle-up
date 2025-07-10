import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User, CreateUserData } from "../models/User";
import {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
} from "../config/jwt";
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
      const {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        companyName,
      } = req.body;

      // Validate required fields
      if (!email || !password || !confirmPassword || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          error: "All fields are required",
          statusCode: 400,
        });
      }

      // Validate email format
      if (!validateEmail(email)) {
        return res.status(400).json({
          success: false,
          error: "Invalid email format",
          statusCode: 400,
        });
      }

      // Validate password strength
      if (!validatePassword(password)) {
        return res.status(400).json({
          success: false,
          error: "Password must be at least 8 characters long",
          statusCode: 400,
        });
      }

      // Validate password confirmation
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          error: "Passwords do not match",
          statusCode: 400,
        });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: "User already exists",
          statusCode: 409,
        });
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
        companyName,
        passwordHash,
        role,
        isEmailVerified: false,
      };

      const user = await User.create(userData);

      // Generate JWT tokens using the proper config
      const tokens = generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Remove sensitive data from response
      const { passwordHash: _, role: userRole, ...userResponse } = user;

      // Transform role to accountType for frontend compatibility
      const accountType =
        userRole === "admin" ? "ADMIN" : userRole === "b2b" ? "B2B" : "B2C";

      return res.status(200).json({
        success: true,
        data: {
          user: {
            ...userResponse,
            accountType,
          },
          tokens,
        },
        statusCode: 200,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal server error",
        statusCode: 500,
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email and password are required",
          statusCode: 400,
        });
      }

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
          statusCode: 401,
        });
      }

      // Check if user has password (Google-only users won't have password)
      if (!user.passwordHash) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
          statusCode: 401,
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
          statusCode: 401,
        });
      }

      // Update last login
      await User.updateLastLogin(user.id);

      // Generate JWT tokens using the proper config
      const tokens = generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Remove sensitive data from response
      const { passwordHash: _, role: userRole, ...userResponse } = user;

      // Transform role to accountType for frontend compatibility
      const accountType =
        userRole === "admin" ? "ADMIN" : userRole === "b2b" ? "B2B" : "B2C";

      return res.status(200).json({
        success: true,
        data: {
          user: {
            ...userResponse,
            accountType,
          },
          tokens,
        },
        statusCode: 200,
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
        return res.status(400).json({
          success: false,
          error: "All Google OAuth fields are required",
          statusCode: 400,
        });
      }

      // Validate email format
      if (!validateEmail(email)) {
        return res.status(400).json({
          success: false,
          error: "Invalid email format",
          statusCode: 400,
        });
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

      // Generate JWT tokens using the proper config
      const tokens = generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Remove sensitive data from response
      const { passwordHash: _, role: userRole, ...userResponse } = user;

      // Transform role to accountType for frontend compatibility
      const accountType =
        userRole === "admin" ? "ADMIN" : userRole === "b2b" ? "B2B" : "B2C";

      return res.status(200).json({
        success: true,
        data: {
          user: {
            ...userResponse,
            accountType,
          },
          tokens,
        },
        statusCode: 200,
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: "Refresh token is required",
          statusCode: 400,
        });
      }

      // Verify refresh token using the proper config
      const decoded = verifyRefreshToken(refreshToken);

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
          statusCode: 404,
        });
      }

      // Generate new tokens
      const tokens = generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return res.status(200).json({
        success: true,
        data: tokens,
        statusCode: 200,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: "Invalid refresh token",
        statusCode: 401,
      });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const user = req.user as
        | { id: string; email: string; role: string }
        | undefined;

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "User not authenticated",
          statusCode: 401,
        });
      }

      const fullUser = await User.findById(user.id);
      if (!fullUser) {
        return res.status(404).json({
          success: false,
          error: "User not found",
          statusCode: 404,
        });
      }

      // Remove sensitive data from response
      const { passwordHash: _, role: userRole, ...userResponse } = fullUser;

      // Transform role to accountType for frontend compatibility
      const accountType =
        userRole === "admin" ? "ADMIN" : userRole === "b2b" ? "B2B" : "B2C";

      return res.status(200).json({
        success: true,
        data: {
          user: {
            ...userResponse,
            accountType,
          },
        },
        statusCode: 200,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal server error",
        statusCode: 500,
      });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const authenticatedUser = req.user as
        | { id: string; email: string; role: string }
        | undefined;

      if (!authenticatedUser) {
        return res.status(401).json({
          success: false,
          error: "User not authenticated",
          statusCode: 401,
        });
      }

      const { currentPassword, newPassword, confirmNewPassword } = req.body;

      // Validate required fields
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({
          success: false,
          error:
            "Current password, new password, and confirmation are required",
          statusCode: 400,
        });
      }

      // Validate new password strength
      if (!validatePassword(newPassword)) {
        return res.status(400).json({
          success: false,
          error: "New password must be at least 8 characters long",
          statusCode: 400,
        });
      }

      // Validate password confirmation
      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({
          success: false,
          error: "New passwords do not match",
          statusCode: 400,
        });
      }

      // Validate password confirmation
      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({
          success: false,
          error: "New passwords do not match",
          statusCode: 400,
        });
      }

      const user = await User.findById(authenticatedUser.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
          statusCode: 404,
        });
      }

      // Check if user has password (Google-only users won't have password)
      if (!user.passwordHash) {
        return res.status(400).json({
          success: false,
          error: "Cannot change password for Google-only accounts",
          statusCode: 400,
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          error: "Current password is incorrect",
          statusCode: 400,
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          error: "Current password is incorrect",
          statusCode: 400,
        });
      }

      // Hash new password
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await User.updateProfile(authenticatedUser.id, {
        passwordHash: newPasswordHash,
      });

      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal server error",
        statusCode: 500,
      });
    }
  }
}
