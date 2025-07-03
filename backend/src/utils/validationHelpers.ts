/**
 * @fileoverview Validation helper utilities
 * @description Centralized functions for common validation patterns
 */

import { Request, Response, NextFunction } from 'express';
import { sendValidationError } from './responseHelpers';

/**
 * Validates required fields in request body
 * @function validateRequiredFields
 * @description Validates that all required fields are present in the request body
 * 
 * @param {string[]} requiredFields - Array of required field names
 * @returns {Function} Express middleware function
 * 
 * @example
 * router.post('/users', validateRequiredFields(['email', 'password', 'firstName']), createUser);
 */
export const validateRequiredFields = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      const fieldList = missingFields.join(', ');
      sendValidationError(res, `Missing required fields: ${fieldList}`);
      return;
    }
    
    next();
  };
};

/**
 * Validates email format
 * @function validateEmail
 * @description Validates that a string is a valid email format
 * 
 * @param {string} email - Email string to validate
 * @returns {boolean} True if email is valid, false otherwise
 * 
 * @example
 * if (!validateEmail(userEmail)) {
 *   return sendValidationError(res, 'Invalid email format');
 * }
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @function validatePassword
 * @description Validates that a password meets minimum security requirements
 * 
 * @param {string} password - Password string to validate
 * @returns {boolean} True if password is valid, false otherwise
 * 
 * @example
 * if (!validatePassword(password)) {
 *   return sendValidationError(res, 'Password must be at least 8 characters long');
 * }
 */
export const validatePassword = (password: string): boolean => {
  return Boolean(password && password.length >= 8);
};

/**
 * Validates numeric value
 * @function validateNumber
 * @description Validates that a value is a valid number
 * 
 * @param {any} value - Value to validate
 * @param {number} min - Minimum value (optional)
 * @param {number} max - Maximum value (optional)
 * @returns {boolean} True if value is a valid number, false otherwise
 * 
 * @example
 * if (!validateNumber(price, 0)) {
 *   return sendValidationError(res, 'Price must be a positive number');
 * }
 */
export const validateNumber = (value: any, min?: number, max?: number): boolean => {
  const num = Number(value);
  
  if (isNaN(num)) {
    return false;
  }
  
  if (min !== undefined && num < min) {
    return false;
  }
  
  if (max !== undefined && num > max) {
    return false;
  }
  
  return true;
};

/**
 * Validates string length
 * @function validateStringLength
 * @description Validates that a string meets length requirements
 * 
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum length (optional)
 * @param {number} maxLength - Maximum length (optional)
 * @returns {boolean} True if string meets length requirements, false otherwise
 * 
 * @example
 * if (!validateStringLength(name, 2, 50)) {
 *   return sendValidationError(res, 'Name must be between 2 and 50 characters');
 * }
 */
export const validateStringLength = (value: string, minLength?: number, maxLength?: number): boolean => {
  if (!value || typeof value !== 'string') {
    return false;
  }
  
  if (minLength !== undefined && value.length < minLength) {
    return false;
  }
  
  if (maxLength !== undefined && value.length > maxLength) {
    return false;
  }
  
  return true;
};

/**
 * Validates enum values
 * @function validateEnum
 * @description Validates that a value is one of the allowed enum values
 * 
 * @param {any} value - Value to validate
 * @param {any[]} allowedValues - Array of allowed values
 * @returns {boolean} True if value is in allowed values, false otherwise
 * 
 * @example
 * if (!validateEnum(role, ['admin', 'b2c', 'b2b'])) {
 *   return sendValidationError(res, 'Invalid role');
 * }
 */
export const validateEnum = (value: any, allowedValues: any[]): boolean => {
  return allowedValues.includes(value);
};

/**
 * Sanitizes request body by removing sensitive fields
 * @function sanitizeRequestBody
 * @description Removes sensitive fields from request body for logging
 * 
 * @param {any} body - Request body object
 * @param {string[]} sensitiveFields - Array of sensitive field names to remove
 * @returns {any} Sanitized request body
 * 
 * @example
 * const sanitizedBody = sanitizeRequestBody(req.body, ['password', 'token']);
 */
export const sanitizeRequestBody = (body: any, sensitiveFields: string[] = ['password', 'token', 'refreshToken']): any => {
  if (!body || typeof body !== 'object') {
    return body;
  }
  
  const sanitized = { ...body };
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
}; 