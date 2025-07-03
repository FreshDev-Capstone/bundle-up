/**
 * @fileoverview Authentication routes configuration
 * @description Defines all authentication-related API endpoints including registration,
 * login, Google OAuth, profile management, and token refresh.
 */

import express from "express";
import passport from "passport";
import { AuthController } from "../controllers/authControllers";
import { checkAuthentication } from "../middleware/auth";

/**
 * Express router for authentication routes
 * @type {express.Router}
 * @description Router instance for all authentication endpoints
 */
const router = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user account
 * @access Public
 *
 * @body {string} email - User's email address
 * @body {string} password - User's password (min 8 characters)
 * @body {string} firstName - User's first name
 * @body {string} lastName - User's last name
 * @body {string} [role] - User's role (individual, b2b, admin)
 *
 * @returns {Object} 201 - User created successfully
 * @returns {Object} 400 - Validation error or user already exists
 * @returns {Object} 500 - Internal server error
 *
 * @example
 * POST /api/auth/register
 * Content-Type: application/json
 *
 * {
 *   "email": "user@example.com",
 *   "password": "securePassword123",
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "role": "individual"
 * }
 */
router.post("/register", AuthController.register);

/**
 * @route POST /api/auth/login
 * @description Authenticate user with email and password
 * @access Public
 *
 * @body {string} email - User's email address
 * @body {string} password - User's password
 *
 * @returns {Object} 200 - Login successful
 * @returns {Object} 400 - Missing credentials
 * @returns {Object} 401 - Invalid credentials
 * @returns {Object} 500 - Internal server error
 *
 * @example
 * POST /api/auth/login
 * Content-Type: application/json
 *
 * {
 *   "email": "user@example.com",
 *   "password": "securePassword123"
 * }
 */
router.post("/login", AuthController.login);

/**
 * @route GET /api/auth/google
 * @description Initiate Google OAuth authentication
 * @access Public
 *
 * @returns {Object} Redirect to Google OAuth consent screen
 *
 * @example
 * GET /api/auth/google
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

/**
 * @route GET /api/auth/google/callback
 * @description Handle Google OAuth callback
 * @access Public
 *
 * @returns {Object} 200 - Authentication successful
 * @returns {Object} 400 - Google profile not found
 * @returns {Object} 500 - Internal server error
 *
 * @example
 * GET /api/auth/google/callback?code=google_oauth_code
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  AuthController.googleAuth
);

/**
 * @route GET /api/auth/profile
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
 * GET /api/auth/profile
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
router.get("/profile", checkAuthentication, AuthController.getProfile);

/**
 * @route PUT /api/auth/profile
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
 * PUT /api/auth/profile
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * Content-Type: application/json
 *
 * {
 *   "firstName": "Jane",
 *   "lastName": "Smith"
 * }
 */
router.put("/profile", checkAuthentication, AuthController.updateProfile);

/**
 * @route POST /api/auth/refresh
 * @description Refresh access token using refresh token
 * @access Public
 *
 * @body {string} refreshToken - JWT refresh token
 *
 * @returns {Object} 200 - New access token generated
 * @returns {Object} 400 - Refresh token missing
 * @returns {Object} 401 - Invalid refresh token
 * @returns {Object} 500 - Internal server error
 *
 * @example
 * POST /api/auth/refresh
 * Content-Type: application/json
 *
 * {
 *   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 */
router.post("/refresh", (req, res) => {
  // TODO: Implement token refresh logic
  res.status(501).json({
    success: false,
    error: "Token refresh not implemented yet",
  });
});

/**
 * @route POST /api/auth/logout
 * @description Logout user (client-side token removal)
 * @access Private (requires authentication)
 *
 * @headers {string} Authorization - Bearer JWT token
 *
 * @returns {Object} 200 - Logout successful
 * @returns {Object} 500 - Internal server error
 *
 * @example
 * POST /api/auth/logout
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
router.post("/logout", checkAuthentication, (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;
