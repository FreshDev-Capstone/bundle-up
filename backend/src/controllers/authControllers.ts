/**
 * @fileoverview Authentication controllers
 * @description Handles all authentication-related HTTP requests and responses
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt';
import { CreateUserData } from '../types/user';
import { 
  sendSuccess, 
  sendError, 
  sendInternalError, 
  sendValidationError, 
  sendAuthError, 
  sendNotFoundError, 
  sendConflictError 
} from '../utils/responseHelpers';
import { 
  validateRequiredFields, 
  validateEmail, 
  validatePassword 
} from '../utils/validationHelpers';

/**
 * Extended Express Request interface with user data
 * @interface AuthenticatedRequest
 * @description Extends Express Request to include authenticated user information
 */
interface AuthenticatedRequest extends Request {
  /** Authenticated user object */
  user?: {
    /** User's unique identifier */
    id: string;
    /** User's email address */
    email: string;
    /** User's role in the system */
    role: 'admin' | 'b2c' | 'b2b';
  };
}

/**
 * Authentication controller class
 * @class AuthController
 * @description Static methods for handling all authentication-related operations
 */
export class AuthController {
  /**
   * Registers a new user account
   * @route POST /api/auth/register
   * @description Creates a new user account with email/password authentication
   * 
   * @param {Request} req - Express request object with user registration data
   * @param {Response} res - Express response object
   * @returns {Promise<void>} JSON response with user data and JWT token or error message
   * 
   * @example
   * POST /api/auth/register
   * {
   *   "email": "user@example.com",
   *   "password": "securepassword123",
   *   "firstName": "John",
   *   "lastName": "Doe"
   * }
   * 
   * Response: {
   *   "success": true,
   *   "data": {
   *     "user": {
   *       "id": "user_123",
   *       "email": "user@example.com",
   *       "firstName": "John",
   *       "lastName": "Doe",
   *       "role": "b2c",
   *       "isEmailVerified": false
   *     },
   *     "token": "jwt_token_here"
   *   }
   * }
   */
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        return sendValidationError(res, 'All fields are required');
      }

      // Validate email format
      if (!validateEmail(email)) {
        return sendValidationError(res, 'Invalid email format');
      }

      // Validate password strength
      if (!validatePassword(password)) {
        return sendValidationError(res, 'Password must be at least 8 characters long');
      }

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return sendConflictError(res, 'User already exists');
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Determine user role based on email
      const isAdmin = await UserModel.isAdminEmail(email);
      const role: 'admin' | 'b2c' | 'b2b' = isAdmin ? 'admin' : 'b2c';

      // Create user
      const userData: CreateUserData = {
        email,
        firstName,
        lastName,
        passwordHash,
        role,
        isEmailVerified: false
      };

      const user = await UserModel.create(userData);

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Remove sensitive data from response
      const { passwordHash: _, ...userResponse } = user;

      return sendSuccess(res, {
        user: userResponse,
        token
      }, 201);
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  /**
   * Authenticates a user and returns JWT token
   * @route POST /api/auth/login
   * @description Authenticates user with email/password and returns JWT token
   * 
   * @param {Request} req - Express request object with login credentials
   * @param {Response} res - Express response object
   * @returns {Promise<void>} JSON response with user data and JWT token or error message
   * 
   * @example
   * POST /api/auth/login
   * {
   *   "email": "user@example.com",
   *   "password": "securepassword123"
   * }
   * 
   * Response: {
   *   "success": true,
   *   "data": {
   *     "user": {
   *       "id": "user_123",
   *       "email": "user@example.com",
   *       "firstName": "John",
   *       "lastName": "Doe",
   *       "role": "b2c"
   *     },
   *     "token": "jwt_token_here"
   *   }
   * }
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return sendValidationError(res, 'Email and password are required');
      }

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return sendAuthError(res, 'Invalid credentials');
      }

      // Check if user has password (Google-only users won't have password)
      if (!user.passwordHash) {
        return sendAuthError(res, 'Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return sendAuthError(res, 'Invalid credentials');
      }

      // Update last login
      await UserModel.updateLastLogin(user.id);

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Remove sensitive data from response
      const { passwordHash: _, ...userResponse } = user;

      return sendSuccess(res, {
        user: userResponse,
        token
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  /**
   * Authenticates a user with Google OAuth
   * @route POST /api/auth/google
   * @description Authenticates or registers user with Google OAuth and returns JWT token
   * 
   * @param {Request} req - Express request object with Google OAuth data
   * @param {Response} res - Express response object
   * @returns {Promise<void>} JSON response with user data and JWT token or error message
   * 
   * @example
   * POST /api/auth/google
   * {
   *   "googleId": "google_oauth_id_123",
   *   "email": "user@gmail.com",
   *   "firstName": "John",
   *   "lastName": "Doe"
   * }
   * 
   * Response: {
   *   "success": true,
   *   "data": {
   *     "user": {
   *       "id": "user_123",
   *       "email": "user@gmail.com",
   *       "firstName": "John",
   *       "lastName": "Doe",
   *       "role": "b2c"
   *     },
   *     "token": "jwt_token_here"
   *   }
   * }
   */
  static async googleAuth(req: Request, res: Response) {
    try {
      const { googleId, email, firstName, lastName } = req.body;

      // Validate required fields
      if (!googleId || !email || !firstName || !lastName) {
        return sendValidationError(res, 'All Google OAuth fields are required');
      }

      // Validate email format
      if (!validateEmail(email)) {
        return sendValidationError(res, 'Invalid email format');
      }

      // Check if user exists by Google ID
      let user = await UserModel.findByGoogleId(googleId);
      
      if (!user) {
        // Check if user exists by email
        user = await UserModel.findByEmail(email);
        
        if (user) {
          // Update existing user with Google ID
          user = await UserModel.updateProfile(user.id, { googleId });
        } else {
          // Create new user
          const isAdmin = await UserModel.isAdminEmail(email);
          const role: 'admin' | 'b2c' | 'b2b' = isAdmin ? 'admin' : 'b2c';
          
          const userData: CreateUserData = {
            email,
            firstName,
            lastName,
            role,
            googleId,
            isEmailVerified: true // Google emails are pre-verified
          };

          user = await UserModel.create(userData);
        }
      }

      // Update last login
      await UserModel.updateLastLogin(user.id);

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Remove sensitive data from response
      const { passwordHash: _, ...userResponse } = user;

      return sendSuccess(res, {
        user: userResponse,
        token
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  /**
   * Gets the current user's profile
   * @route GET /api/auth/profile
   * @description Retrieves the authenticated user's profile information
   * 
   * @param {AuthenticatedRequest} req - Express request object with authenticated user
   * @param {Response} res - Express response object
   * @returns {Promise<void>} JSON response with user profile or error message
   * 
   * @example
   * GET /api/auth/profile
   * Authorization: Bearer jwt_token_here
   * 
   * Response: {
   *   "success": true,
   *   "data": {
   *     "user": {
   *       "id": "user_123",
   *       "email": "user@example.com",
   *       "firstName": "John",
   *       "lastName": "Doe",
   *       "role": "b2c"
   *     }
   *   }
   * }
   */
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return sendAuthError(res, 'User not authenticated');
      }

      const user = await UserModel.findById(userId);

      if (!user) {
        return sendNotFoundError(res, 'User not found');
      }

      // Remove sensitive data from response
      const { passwordHash: _, ...userResponse } = user;

      return sendSuccess(res, {
        user: userResponse
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  /**
   * Updates the current user's profile
   * @route PUT /api/auth/profile
   * @description Updates the authenticated user's profile information
   * 
   * @param {AuthenticatedRequest} req - Express request object with authenticated user and update data
   * @param {Response} res - Express response object
   * @returns {Promise<void>} JSON response with updated user profile or error message
   * 
   * @example
   * PUT /api/auth/profile
   * Authorization: Bearer jwt_token_here
   * {
   *   "firstName": "Jane",
   *   "lastName": "Smith"
   * }
   * 
   * Response: {
   *   "success": true,
   *   "data": {
   *     "user": {
   *       "id": "user_123",
   *       "email": "user@example.com",
   *       "firstName": "Jane",
   *       "lastName": "Smith",
   *       "role": "b2c"
   *     }
   *   }
   * }
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return sendAuthError(res, 'User not authenticated');
      }

      const { firstName, lastName } = req.body;

      // Validate required fields
      if (!firstName || !lastName) {
        return sendValidationError(res, 'First name and last name are required');
      }

      const user = await UserModel.findById(userId);

      if (!user) {
        return sendNotFoundError(res, 'User not found');
      }

      // Update user profile
      const updatedUser = await UserModel.updateProfile(userId, {
        firstName,
        lastName
      });

      // Remove sensitive data from response
      const { passwordHash: _, ...userResponse } = updatedUser;

      return sendSuccess(res, {
        user: userResponse
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  /**
   * Changes the current user's password
   * @route PUT /api/auth/change-password
   * @description Changes the authenticated user's password
   * 
   * @param {AuthenticatedRequest} req - Express request object with authenticated user and password data
   * @param {Response} res - Express response object
   * @returns {Promise<void>} JSON response with success message or error message
   * 
   * @example
   * PUT /api/auth/change-password
   * Authorization: Bearer jwt_token_here
   * {
   *   "currentPassword": "oldpassword123",
   *   "newPassword": "newpassword123"
   * }
   * 
   * Response: {
   *   "success": true,
   *   "message": "Password changed successfully"
   * }
   */
  static async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return sendAuthError(res, 'User not authenticated');
      }

      const { currentPassword, newPassword } = req.body;

      // Validate required fields
      if (!currentPassword || !newPassword) {
        return sendValidationError(res, 'Current password and new password are required');
      }

      // Validate new password strength
      if (!validatePassword(newPassword)) {
        return sendValidationError(res, 'New password must be at least 8 characters long');
      }

      const user = await UserModel.findById(userId);

      if (!user) {
        return sendNotFoundError(res, 'User not found');
      }

      // Check if user has password (Google-only users won't have password)
      if (!user.passwordHash) {
        return sendAuthError(res, 'Cannot change password for Google-only accounts');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isCurrentPasswordValid) {
        return sendAuthError(res, 'Current password is incorrect');
      }

      // Hash new password
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await UserModel.updateProfile(userId, {
        passwordHash: newPasswordHash
      });

      return sendSuccess(res, {
        message: 'Password changed successfully'
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }

  /**
   * Verifies a user's email address
   * @route POST /api/auth/verify-email
   * @description Marks a user's email as verified (typically called with email verification token)
   * 
   * @param {Request} req - Express request object with verification token
   * @param {Response} res - Express response object
   * @returns {Promise<void>} JSON response with success message or error message
   * 
   * @example
   * POST /api/auth/verify-email
   * {
   *   "token": "email_verification_token_here"
   * }
   * 
   * Response: {
   *   "success": true,
   *   "message": "Email verified successfully"
   * }
   */
  static async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return sendValidationError(res, 'Verification token is required');
      }

      // Verify token and extract user ID
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const userId = decoded.userId;

      const user = await UserModel.findById(userId);

      if (!user) {
        return sendNotFoundError(res, 'User not found');
      }

      if (user.isEmailVerified) {
        return sendError(res, 'Email is already verified', 400);
      }

      // Mark email as verified
      await UserModel.verifyEmail(userId);

      return sendSuccess(res, {
        message: 'Email verified successfully'
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return sendValidationError(res, 'Invalid verification token');
      }

      return sendInternalError(res, error as Error);
    }
  }

  /**
   * Refreshes a JWT token
   * @route POST /api/auth/refresh
   * @description Refreshes an existing JWT token with a new expiration time
   * 
   * @param {AuthenticatedRequest} req - Express request object with authenticated user
   * @param {Response} res - Express response object
   * @returns {Promise<void>} JSON response with new JWT token or error message
   * 
   * @example
   * POST /api/auth/refresh
   * Authorization: Bearer jwt_token_here
   * 
   * Response: {
   *   "success": true,
   *   "data": {
   *     "token": "new_jwt_token_here"
   *   }
   * }
   */
  static async refreshToken(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return sendAuthError(res, 'User not authenticated');
      }

      const user = await UserModel.findById(userId);

      if (!user) {
        return sendNotFoundError(res, 'User not found');
      }

      // Generate new JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return sendSuccess(res, {
        token
      });
    } catch (error) {
      return sendInternalError(res, error as Error);
    }
  }
} 