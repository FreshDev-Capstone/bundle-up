/**
 * @fileoverview Authentication middleware functions
 * @description JWT token verification and role-based authorization middleware.
 * Provides authentication and authorization checks for protected routes.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

/**
 * JWT secret key for token verification
 * @type {string}
 * @description Secret key loaded from environment variables with fallback
 */
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * JWT payload interface for token contents
 * @interface JWTPayload
 * @description Defines the structure of data stored in JWT tokens
 */
interface JWTPayload {
  /** User's unique identifier */
  userId: string;
  /** User's email address */
  email: string;
  /** User's role in the system */
  role: string;
  /** Token issuance timestamp */
  iat?: number;
  /** Token expiration timestamp */
  exp?: number;
}

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
 * Verifies JWT token and attaches user data to request
 * @function authenticateJWT
 * @description Middleware that verifies JWT tokens and extracts user information
 * 
 * @param {AuthenticatedRequest} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void} Calls next() with user data attached to request or sends error response
 * 
 * @example
 * // Apply to route
 * router.get('/protected', authenticateJWT, (req, res) => {
 *   console.log(req.user); // { id: 'user_123', email: 'user@example.com', role: 'admin' }
 * });
 * 
 * @throws {401} Unauthorized - If token is missing or invalid
 * @throws {401} Token expired - If token has expired
 * @throws {500} Internal server error - If token verification fails
 */
export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Access token required'
      });
      return;
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    // Check if user still exists in database
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    // Attach user data to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role as 'admin' | 'b2c' | 'b2b'
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    } else {
      console.error('JWT verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
};

/**
 * Verifies JWT token and attaches user data to request (for controllers)
 * @function checkAuthentication
 * @description Middleware that verifies JWT tokens and extracts user information for route protection
 * This is a wrapper around authenticateJWT that adapts the user interface for controllers
 * 
 * @param {AuthenticatedRequest} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void} Calls next() with user data attached to request or sends error response
 * 
 * @example
 * // Apply to protected routes
 * router.get('/profile', checkAuthentication, (req, res) => {
 *   const userId = req.user?.id;
 *   // Handle authenticated request
 * });
 * 
 * @throws {401} Unauthorized - If token is missing, invalid, or expired
 * @throws {500} Internal server error - If token verification fails
 */
export const checkAuthentication = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  // Create a temporary request object with the AuthenticatedRequest interface
  const tempReq = req as unknown as AuthenticatedRequest;
  
  // Use the authenticateJWT function
  authenticateJWT(tempReq, res, (err?: any) => {
    if (err) {
      return next(err);
    }
    
    // Convert the user data to the controller interface
    if (tempReq.user) {
      req.user = {
        id: tempReq.user.id,
        email: tempReq.user.email,
        role: tempReq.user.role as 'admin' | 'b2c' | 'b2b'
      };
    }
    
    next();
  });
};

/**
 * Requires user to have admin role
 * @function requireAdmin
 * @description Middleware that checks if authenticated user has admin role
 * 
 * @param {AuthenticatedRequest} req - Express request object (requires authentication)
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void} Calls next() if user is admin or sends error response
 * 
 * @example
 * // Apply to admin-only routes
 * router.post('/admin/products', authenticateJWT, requireAdmin, (req, res) => {
 *   // Only admins can access this route
 * });
 * 
 * @throws {401} Unauthorized - If user is not authenticated
 * @throws {403} Forbidden - If user is not an admin
 */
export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
    return;
  }

  next();
};

/**
 * Requires user to have B2B role
 * @function requireB2B
 * @description Middleware that checks if authenticated user has B2B role
 * 
 * @param {AuthenticatedRequest} req - Express request object (requires authentication)
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void} Calls next() if user has B2B role or sends error response
 * 
 * @example
 * // Apply to B2B-only routes
 * router.get('/b2b/products', authenticateJWT, requireB2B, (req, res) => {
 *   // Only B2B customers can access this route
 * });
 * 
 * @throws {401} Unauthorized - If user is not authenticated
 * @throws {403} Forbidden - If user is not B2B
 */
export const requireB2B = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
    return;
  }

  if (req.user.role !== 'b2b') {
    res.status(403).json({
      success: false,
      error: 'B2B access required'
    });
    return;
  }

  next();
};

/**
 * Requires user to have B2B or admin role
 * @function requireB2BOrAdmin
 * @description Middleware that checks if authenticated user has B2B or admin role
 * 
 * @param {AuthenticatedRequest} req - Express request object (requires authentication)
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void} Calls next() if user has B2B or admin role or sends error response
 * 
 * @example
 * // Apply to B2B/admin routes
 * router.get('/b2b/products', authenticateJWT, requireB2BOrAdmin, (req, res) => {
 *   // B2B customers and admins can access this route
 * });
 * 
 * @throws {401} Unauthorized - If user is not authenticated
 * @throws {403} Forbidden - If user is not B2B or admin
 */
export const requireB2BOrAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
    return;
  }

  if (req.user.role !== 'b2b' && req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'B2B or admin access required'
    });
    return;
  }

  next();
};

/**
 * Optional authentication middleware
 * @function optionalAuth
 * @description Middleware that verifies JWT token if present but doesn't require it
 * 
 * @param {AuthenticatedRequest} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void} Always calls next(), optionally attaching user data to request
 * 
 * @example
 * // Apply to routes that work with or without authentication
 * router.get('/products', optionalAuth, (req, res) => {
 *   if (req.user) {
 *     // User is authenticated, show personalized content
 *   } else {
 *     // User is not authenticated, show public content
 *   }
 * });
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without authentication
      next();
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    // Check if user still exists
    const user = await UserModel.findById(decoded.userId);
    if (user) {
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role as 'admin' | 'b2c' | 'b2b'
      };
    }

    next();
  } catch (error) {
    // Token is invalid, but we don't fail the request
    // Just continue without authentication
    next();
  }
}; 