/**
 * @fileoverview Authentication service functions
 * @description Business logic layer for authentication operations including user validation,
 * password hashing, token management, and Google OAuth integration.
 */

import bcrypt from "bcryptjs";
import { UserModel, User, CreateUserData } from "../models/User";
import {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
} from "../config/jwt";

/**
 * User registration data interface
 * @interface RegisterData
 * @description Defines the structure of user registration data
 */
export interface RegisterData {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's role (optional) */
  role?: "admin" | "b2c" | "b2b";
}

/**
 * User login data interface
 * @interface LoginData
 * @description Defines the structure of user login data
 */
export interface LoginData {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Google OAuth data interface
 * @interface GoogleAuthData
 * @description Defines the structure of Google OAuth authentication data
 */
export interface GoogleAuthData {
  /** Google OAuth ID */
  googleId: string;
  /** User's email from Google */
  email: string;
  /** User's first name from Google */
  firstName: string;
  /** User's last name from Google */
  lastName: string;
}

/**
 * Authentication result interface
 * @interface AuthResult
 * @description Defines the structure of authentication operation results
 */
export interface AuthResult {
  /** Whether the operation was successful */
  success: boolean;
  /** User data (if successful) */
  user?: User;
  /** Authentication tokens (if successful) */
  tokens?: {
    /** JWT access token */
    accessToken: string;
    /** JWT refresh token */
    refreshToken: string;
  };
  /** Error message (if failed) */
  error?: string;
}

/**
 * Authentication service class
 * @class AuthService
 * @description Static methods for handling authentication business logic
 */
export class AuthService {
  /**
   * Registers a new user in the system
   * @param {RegisterData} data - User registration data
   * @returns {Promise<AuthResult>} Registration result with user data and tokens
   *
   * @example
   * const result = await AuthService.register({
   *   email: 'user@example.com',
   *   password: 'securePassword123',
   *   firstName: 'John',
   *   lastName: 'Doe'
   * });
   *
   * if (result.success) {
   *   console.log('User registered:', result.user);
   *   console.log('Tokens:', result.tokens);
   * } else {
   *   console.error('Registration failed:', result.error);
   * }
   */
  static async register(data: RegisterData): Promise<AuthResult> {
    try {
      // Check if user already exists
      const existingUser = await UserModel.findByEmail(data.email);
      if (existingUser) {
        return {
          success: false,
          error: "User with this email already exists",
        };
      }

      // Determine user role based on email
      const userRole = (await UserModel.isAdminEmail(data.email))
        ? "admin"
        : "b2c";

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(data.password, saltRounds);

      // Create user
      const userData: CreateUserData = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        passwordHash,
        role: userRole,
        isEmailVerified: false,
      };

      const user = await UserModel.create(userData);

      // Generate tokens
      const tokens = generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Update last login
      await UserModel.updateLastLogin(user.id);

      return {
        success: true,
        user,
        tokens,
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  /**
   * Authenticates a user with email and password
   * @param {LoginData} data - User login data
   * @returns {Promise<AuthResult>} Authentication result with user data and tokens
   *
   * @example
   * const result = await AuthService.login({
   *   email: 'user@example.com',
   *   password: 'securePassword123'
   * });
   *
   * if (result.success) {
   *   console.log('Login successful:', result.user);
   *   console.log('Tokens:', result.tokens);
   * } else {
   *   console.error('Login failed:', result.error);
   * }
   */
  static async login(data: LoginData): Promise<AuthResult> {
    try {
      // Find user by email
      const user = await UserModel.findByEmail(data.email);
      if (!user) {
        return {
          success: false,
          error: "Invalid credentials",
        };
      }

      // Check if user has password (not Google-only user)
      if (!user.passwordHash) {
        return {
          success: false,
          error: "Please sign in with Google",
        };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(
        data.password,
        user.passwordHash
      );
      if (!isValidPassword) {
        return {
          success: false,
          error: "Invalid credentials",
        };
      }

      // Generate tokens
      const tokens = generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Update last login
      await UserModel.updateLastLogin(user.id);

      return {
        success: true,
        user,
        tokens,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  /**
   * Authenticates or registers a user with Google OAuth
   * @param {GoogleAuthData} data - Google OAuth data
   * @returns {Promise<AuthResult>} Authentication result with user data and tokens
   *
   * @example
   * const result = await AuthService.googleAuth({
   *   googleId: 'google_oauth_id_123',
   *   email: 'user@gmail.com',
   *   firstName: 'John',
   *   lastName: 'Doe'
   * });
   *
   * if (result.success) {
   *   console.log('Google auth successful:', result.user);
   *   console.log('Tokens:', result.tokens);
   * } else {
   *   console.error('Google auth failed:', result.error);
   * }
   */
  static async googleAuth(data: GoogleAuthData): Promise<AuthResult> {
    try {
      // Check if user exists by Google ID
      let user = await UserModel.findByGoogleId(data.googleId);

      if (!user) {
        // Check if user exists by email
        user = await UserModel.findByEmail(data.email);

        if (user) {
          // Update existing user with Google ID
          user = await UserModel.updateProfile(user.id, {
            googleId: data.googleId,
          });
        } else {
          // Create new user
          const userRole = (await UserModel.isAdminEmail(data.email))
            ? "admin"
            : "b2c";

          const userData: CreateUserData = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: userRole,
            googleId: data.googleId,
            isEmailVerified: true, // Google emails are pre-verified
          };

          user = await UserModel.create(userData);
        }
      }

      // Generate tokens
      const tokens = generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Update last login
      await UserModel.updateLastLogin(user.id);

      return {
        success: true,
        user,
        tokens,
      };
    } catch (error) {
      console.error("Google auth error:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  /**
   * Refreshes an access token using a refresh token
   * @param {string} refreshToken - JWT refresh token
   * @returns {Promise<AuthResult>} Token refresh result with new access token
   *
   * @example
   * const result = await AuthService.refreshToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
   *
   * if (result.success) {
   *   console.log('New access token:', result.tokens?.accessToken);
   * } else {
   *   console.error('Token refresh failed:', result.error);
   * }
   */
  static async refreshToken(refreshToken: string): Promise<AuthResult> {
    try {
      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken);

      // Check if user still exists
      const user = await UserModel.findById(payload.userId);
      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      // Generate new access token
      const accessToken = generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      }).accessToken;

      return {
        success: true,
        user,
        tokens: {
          accessToken,
          refreshToken, // Return the same refresh token
        },
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      return {
        success: false,
        error: "Invalid refresh token",
      };
    }
  }

  /**
   * Validates an access token and returns user data
   * @param {string} accessToken - JWT access token
   * @returns {Promise<AuthResult>} Token validation result with user data
   *
   * @example
   * const result = await AuthService.validateToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
   *
   * if (result.success) {
   *   console.log('Token valid, user:', result.user);
   * } else {
   *   console.error('Token invalid:', result.error);
   * }
   */
  static async validateToken(accessToken: string): Promise<AuthResult> {
    try {
      // Verify access token
      const payload = verifyAccessToken(accessToken);

      // Check if user still exists
      const user = await UserModel.findById(payload.userId);
      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error("Token validation error:", error);
      return {
        success: false,
        error: "Invalid token",
      };
    }
  }
}
