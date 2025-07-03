/**
 * @fileoverview Session routes configuration
 * @description Defines all session-related API endpoints following RESTful principles
 */

import express from "express";
import passport from "passport";
import { AuthController } from "../controllers/authControllers";
import { checkAuthentication } from "../middleware/auth";

/**
 * Express router for session routes
 * @type {express.Router}
 * @description Router instance for all session-related endpoints
 */
const router = express.Router();

/**
 * @route POST /api/sessions
 * @description Create a new session (login)
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
 * POST /api/sessions
 * Content-Type: application/json
 *
 * {
 *   "email": "user@example.com",
 *   "password": "securePassword123"
 * }
 */
router.post("/", AuthController.login);

/**
 * @route DELETE /api/sessions
 * @description Delete current session (logout)
 * @access Private (requires authentication)
 *
 * @headers {string} Authorization - Bearer JWT token
 *
 * @returns {Object} 200 - Logout successful
 * @returns {Object} 500 - Internal server error
 *
 * @example
 * DELETE /api/sessions
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
router.delete(
  "/",
  checkAuthentication,
  (req: express.Request, res: express.Response) => {
    // In a stateless JWT system, logout is handled client-side
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  }
);

/**
 * @route POST /api/sessions/refresh
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
 * POST /api/sessions/refresh
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
 * @route GET /api/sessions/google
 * @description Initiate Google OAuth authentication
 * @access Public
 *
 * @returns {Object} Redirect to Google OAuth consent screen
 *
 * @example
 * GET /api/sessions/google
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

/**
 * @route GET /api/sessions/google/callback
 * @description Handle Google OAuth callback
 * @access Public
 *
 * @returns {Object} 200 - Authentication successful
 * @returns {Object} 400 - Google profile not found
 * @returns {Object} 500 - Internal server error
 *
 * @example
 * GET /api/sessions/google/callback?code=google_oauth_code
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  AuthController.googleAuth
);

export default router;
