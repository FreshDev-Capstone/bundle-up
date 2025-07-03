/**
 * @fileoverview Response helper utilities
 * @description Centralized functions for common API response patterns and error handling
 */

import { Response } from 'express';

/**
 * Standard API response structure
 * @interface ApiResponse
 * @description Defines the structure of all API responses
 */
export interface ApiResponse<T = any> {
  /** Whether the operation was successful */
  success: boolean;
  /** Response data (if successful) */
  data?: T;
  /** Error message (if failed) */
  error?: string;
  /** HTTP status code */
  statusCode?: number;
  /** Response timestamp */
  timestamp?: string;
}

/**
 * Sends a successful API response
 * @function sendSuccess
 * @description Sends a standardized success response
 * 
 * @param {Response} res - Express response object
 * @param {any} data - Response data
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {Response} Express response object
 * 
 * @example
 * sendSuccess(res, { user: userData }, 201);
 */
export const sendSuccess = (res: Response, data: any, statusCode: number = 200): Response => {
  return res.status(statusCode).json({
    success: true,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Sends an error API response
 * @function sendError
 * @description Sends a standardized error response
 * 
 * @param {Response} res - Express response object
 * @param {string} error - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @returns {Response} Express response object
 * 
 * @example
 * sendError(res, 'User not found', 404);
 */
export const sendError = (res: Response, error: string, statusCode: number = 400): Response => {
  return res.status(statusCode).json({
    success: false,
    error,
    statusCode,
    timestamp: new Date().toISOString()
  });
};

/**
 * Sends an internal server error response
 * @function sendInternalError
 * @description Sends a standardized internal server error response
 * 
 * @param {Response} res - Express response object
 * @param {Error} error - Error object for logging
 * @returns {Response} Express response object
 * 
 * @example
 * sendInternalError(res, error);
 */
export const sendInternalError = (res: Response, error: Error): Response => {
  console.error('Internal server error:', error);
  return sendError(res, 'Internal server error', 500);
};

/**
 * Sends a validation error response
 * @function sendValidationError
 * @description Sends a standardized validation error response
 * 
 * @param {Response} res - Express response object
 * @param {string} error - Validation error message
 * @returns {Response} Express response object
 * 
 * @example
 * sendValidationError(res, 'Email is required');
 */
export const sendValidationError = (res: Response, error: string): Response => {
  return sendError(res, error, 400);
};

/**
 * Sends an authentication error response
 * @function sendAuthError
 * @description Sends a standardized authentication error response
 * 
 * @param {Response} res - Express response object
 * @param {string} error - Authentication error message
 * @returns {Response} Express response object
 * 
 * @example
 * sendAuthError(res, 'Invalid credentials');
 */
export const sendAuthError = (res: Response, error: string): Response => {
  return sendError(res, error, 401);
};

/**
 * Sends a forbidden error response
 * @function sendForbiddenError
 * @description Sends a standardized forbidden error response
 * 
 * @param {Response} res - Express response object
 * @param {string} error - Forbidden error message
 * @returns {Response} Express response object
 * 
 * @example
 * sendForbiddenError(res, 'Admin access required');
 */
export const sendForbiddenError = (res: Response, error: string): Response => {
  return sendError(res, error, 403);
};

/**
 * Sends a not found error response
 * @function sendNotFoundError
 * @description Sends a standardized not found error response
 * 
 * @param {Response} res - Express response object
 * @param {string} error - Not found error message
 * @returns {Response} Express response object
 * 
 * @example
 * sendNotFoundError(res, 'User not found');
 */
export const sendNotFoundError = (res: Response, error: string): Response => {
  return sendError(res, error, 404);
};

/**
 * Sends a conflict error response
 * @function sendConflictError
 * @description Sends a standardized conflict error response
 * 
 * @param {Response} res - Express response object
 * @param {string} error - Conflict error message
 * @returns {Response} Express response object
 * 
 * @example
 * sendConflictError(res, 'User already exists');
 */
export const sendConflictError = (res: Response, error: string): Response => {
  return sendError(res, error, 409);
}; 