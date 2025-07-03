/**
 * @fileoverview User routes configuration
 * @description Defines all user-related API endpoints following RESTful principles
 */

import express from 'express';
import { AuthController } from '../controllers/authControllers';
import { checkAuthentication } from '../middleware/auth';

/**
 * Express router for user routes
 * @type {express.Router}
 * @description Router instance for all user-related endpoints
 */
const router = express.Router();

/**
 * @route POST /api/users
 * @description Register a new user account
 * @access Public
 * 
 * @body {string} email - User's email address
 * @body {string} password - User's password (min 8 characters)
 * @body {string} firstName - User's first name
 * @body {string} lastName - User's last name
 * 
 * @returns {Object} 201 - User created successfully
 * @returns {Object} 400 - Validation error or user already exists
 * @returns {Object} 500 - Internal server error
 * 
 * @example
 * POST /api/users
 * Content-Type: application/json
 * 
 * {
 *   "email": "user@example.com",
 *   "password": "securePassword123",
 *   "firstName": "John",
 *   "lastName": "Doe"
 * }
 */
router.post('/', AuthController.register);

/**
 * @route GET /api/users/me
 * @description Get current user's profile information
 * @access Private (requires authentication)
 * 
 * @headers {string} Authorization - Bearer JWT token
 * 
 * @returns {Object} 200 - User profile data
 * @returns {Object} 401 - User not authenticated
 * @returns {Object} 404 - User not found
 * @returns {Object} 500 - Internal server error
 * 
 * @example
 * GET /api/users/me
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
router.get('/me', checkAuthentication, AuthController.getProfile);

/**
 * @route PUT /api/users/me
 * @description Update current user's profile information
 * @access Private (requires authentication)
 * 
 * @headers {string} Authorization - Bearer JWT token
 * @body {string} firstName - User's first name
 * @body {string} lastName - User's last name
 * 
 * @returns {Object} 200 - Profile updated successfully
 * @returns {Object} 400 - Validation error
 * @returns {Object} 401 - User not authenticated
 * @returns {Object} 500 - Internal server error
 * 
 * @example
 * PUT /api/users/me
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * Content-Type: application/json
 * 
 * {
 *   "firstName": "Jane",
 *   "lastName": "Smith"
 * }
 */
router.put('/me', checkAuthentication, AuthController.updateProfile);

/**
 * @route PUT /api/users/me/password
 * @description Change current user's password
 * @access Private (requires authentication)
 * 
 * @headers {string} Authorization - Bearer JWT token
 * @body {string} currentPassword - Current password
 * @body {string} newPassword - New password (min 8 characters)
 * 
 * @returns {Object} 200 - Password changed successfully
 * @returns {Object} 400 - Validation error
 * @returns {Object} 401 - User not authenticated or current password incorrect
 * @returns {Object} 500 - Internal server error
 * 
 * @example
 * PUT /api/users/me/password
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * Content-Type: application/json
 * 
 * {
 *   "currentPassword": "oldPassword123",
 *   "newPassword": "newPassword123"
 * }
 */
router.put('/me/password', checkAuthentication, AuthController.changePassword);

export default router; 