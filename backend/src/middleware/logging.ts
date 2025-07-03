/**
 * @fileoverview Consolidated logging middleware
 * @description Middleware that logs incoming HTTP requests, responses, and errors with detailed information
 * for debugging, monitoring, and error tracking.
 */

import { Request, Response, NextFunction } from 'express';
import { sanitizeRequestBody } from '../utils/validationHelpers';

/**
 * Extended Express Request interface with user data
 * @interface AuthenticatedRequest
 * @description Extends Express Request to include authenticated user information
 */
interface AuthenticatedRequest extends Request {
  /** Authenticated user object */
  user?: {
    /** User's unique identifier */
    userId: string;
    /** User's email address */
    email: string;
    /** User's role in the system */
    role: string;
  };
}

/**
 * Extended Express Request interface with timing data
 * @interface TimedRequest
 * @description Extends Express Request to include timing information for response time calculation
 */
interface TimedRequest extends Request {
  /** Request start time for calculating response time */
  startTime?: number;
}

/**
 * Logs incoming HTTP requests with detailed information
 * @function logRoutes
 * @description Middleware that captures and logs request details including method, URL,
 * user agent, IP address, and calculates response time for monitoring and debugging
 * 
 * @param {TimedRequest} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void} Calls next() after logging request information
 * 
 * @example
 * // Apply globally to all routes
 * app.use(logRoutes);
 * 
 * // Or apply to specific routes
 * router.use(logRoutes);
 * 
 * // Logs will appear like:
 * // [2025-06-22T01:41:49.501Z] GET /api/products 200 45ms - Mozilla/5.0... (::1)
 */
export const logRoutes = (req: TimedRequest, res: Response, next: NextFunction): void => {
  // Record start time
  req.startTime = Date.now();

  // Get client IP address
  const clientIP = req.ip || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress || 
                   (req.connection as any).socket?.remoteAddress || 
                   'unknown';

  // Get user agent
  const userAgent = req.get('User-Agent') || 'unknown';

  // Log request start
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${userAgent} (${clientIP})`);

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any, cb?: any): Response {
    const responseTime = Date.now() - (req.startTime || 0);
    
    // Log response with status code and response time
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime}ms - ${userAgent} (${clientIP})`);
    
    // Call original end method
    return originalEnd.call(this, chunk, encoding, cb);
  };

  next();
};

/**
 * Logs application errors with detailed context information
 * @function logErrors
 * @description Middleware that captures and logs error details including stack traces,
 * request information, user context, and error metadata for debugging and monitoring
 * 
 * @param {Error} err - Error object
 * @param {AuthenticatedRequest} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void} Calls next() to pass error to error handling middleware
 * 
 * @example
 * // Apply as error handling middleware (after all other middleware)
 * app.use(logErrors);
 * 
 * // Error logs will appear like:
 * // [ERROR] 2025-06-22T01:41:49.501Z - Database connection failed
 * // Request: GET /api/products
 * // User: user_123 (user@example.com)
 * // Stack: Error: Database connection failed...
 */
export const logErrors = (
  err: Error,
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.get('User-Agent') || 'Unknown';
  const clientIP = req.ip || req.connection.remoteAddress || 'Unknown';
  
  // Get user information if available
  const userInfo = req.user ? 
    `${req.user.userId} (${req.user.email})` : 
    'Unauthenticated';

  // Log error with context
  console.error(`[ERROR] ${timestamp} - ${err.message}`);
  console.error(`Request: ${method} ${url}`);
  console.error(`User: ${userInfo}`);
  console.error(`IP: ${clientIP}`);
  console.error(`User-Agent: ${userAgent}`);
  console.error(`Stack: ${err.stack}`);

  // Log request body for debugging (excluding sensitive data)
  if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
    const sanitizedBody = sanitizeRequestBody(req.body);
    console.error(`Request Body:`, sanitizedBody);
  }

  // Pass error to next middleware
  next(err);
};

/**
 * Logs database-specific errors with detailed information
 * @function logDatabaseErrors
 * @description Middleware that captures and logs database constraint violations and other database errors
 * 
 * @param {any} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void} Calls next() to pass error to error handling middleware
 * 
 * @example
 * // Apply as error handling middleware for database errors
 * app.use(logDatabaseErrors);
 */
export const logDatabaseErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code && err.code.startsWith('23')) {
    // PostgreSQL constraint violation errors
    console.error(`[DATABASE CONSTRAINT ERROR] ${err.message}`);
    console.error(`Table: ${err.table}, Column: ${err.column}, Constraint: ${err.constraint}`);
  } else if (err.code === '23505') {
    // Unique constraint violation
    console.error(`[UNIQUE CONSTRAINT VIOLATION] ${err.message}`);
  } else if (err.code === '23503') {
    // Foreign key constraint violation
    console.error(`[FOREIGN KEY VIOLATION] ${err.message}`);
  }
  
  next(err);
};

/**
 * Logs authentication-related errors
 * @function logAuthErrors
 * @description Middleware that captures and logs authentication and authorization errors
 * 
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void} Calls next() to pass error to error handling middleware
 * 
 * @example
 * // Apply as error handling middleware for auth errors
 * app.use(logAuthErrors);
 */
export const logAuthErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const clientIP = req.ip || req.connection.remoteAddress || 'Unknown';

  // Check if it's an authentication-related error
  if (err.message.includes('token') || 
      err.message.includes('authentication') || 
      err.message.includes('authorization') ||
      err.message.includes('unauthorized')) {
    
    console.error(`[AUTH ERROR] ${timestamp} - ${err.message}`);
    console.error(`Request: ${method} ${url}`);
    console.error(`IP: ${clientIP}`);
    console.error(`Stack: ${err.stack}`);
  }
  
  next(err);
}; 