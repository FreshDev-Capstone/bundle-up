/**
 * @fileoverview JWT (JSON Web Token) configuration and utilities
 * @description JWT configuration for authentication tokens, including secret keys,
 * token expiration settings, and token generation/verification utilities.
 */

import jwt from 'jsonwebtoken';

/**
 * JWT configuration interface
 * @interface JWTConfig
 * @description Defines JWT configuration parameters including secrets and expiration times
 */
export interface JWTConfig {
  /** Secret key for signing JWT tokens */
  secret: string;
  /** Secret key for refreshing JWT tokens */
  refreshSecret: string;
  /** Access token expiration time in seconds */
  accessTokenExpiry: number;
  /** Refresh token expiration time in seconds */
  refreshTokenExpiry: number;
}

/**
 * JWT configuration object
 * @type {JWTConfig}
 * @description Configuration loaded from environment variables with fallback defaults
 * 
 * @example
 * {
 *   secret: 'your-secret-key',
 *   refreshSecret: 'your-refresh-secret-key',
 *   accessTokenExpiry: 3600, // 1 hour
 *   refreshTokenExpiry: 2592000 // 30 days
 * }
 */
export const jwtConfig: JWTConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  accessTokenExpiry: parseInt(process.env.JWT_ACCESS_EXPIRY || '3600'), // 1 hour
  refreshTokenExpiry: parseInt(process.env.JWT_REFRESH_EXPIRY || '2592000') // 30 days
};

/**
 * JWT payload interface for token contents
 * @interface JWTPayload
 * @description Defines the structure of data stored in JWT tokens
 */
export interface JWTPayload {
  /** User's unique identifier */
  userId: string;
  /** User's email address */
  email: string;
  /** User's role in the system */
  role: string;
  /** Token type (access or refresh) */
  type: 'access' | 'refresh';
  /** Token issuance timestamp */
  iat?: number;
  /** Token expiration timestamp */
  exp?: number;
}

/**
 * Generates an access token for a user
 * @param {Object} payload - User data to include in token
 * @param {string} payload.userId - User's unique identifier
 * @param {string} payload.email - User's email address
 * @param {string} payload.role - User's role
 * @returns {string} Signed JWT access token
 * 
 * @example
 * const token = generateAccessToken({
 *   userId: 'user_123',
 *   email: 'user@example.com',
 *   role: 'individual'
 * });
 */
export function generateAccessToken(payload: Omit<JWTPayload, 'type' | 'iat' | 'exp'>): string {
  return jwt.sign(
    { ...payload, type: 'access' },
    jwtConfig.secret,
    { expiresIn: jwtConfig.accessTokenExpiry }
  );
}

/**
 * Generates a refresh token for a user
 * @param {Object} payload - User data to include in token
 * @param {string} payload.userId - User's unique identifier
 * @param {string} payload.email - User's email address
 * @param {string} payload.role - User's role
 * @returns {string} Signed JWT refresh token
 * 
 * @example
 * const refreshToken = generateRefreshToken({
 *   userId: 'user_123',
 *   email: 'user@example.com',
 *   role: 'individual'
 * });
 */
export function generateRefreshToken(payload: Omit<JWTPayload, 'type' | 'iat' | 'exp'>): string {
  return jwt.sign(
    { ...payload, type: 'refresh' },
    jwtConfig.refreshSecret,
    { expiresIn: jwtConfig.refreshTokenExpiry }
  );
}

/**
 * Verifies and decodes an access token
 * @param {string} token - JWT access token to verify
 * @returns {JWTPayload} Decoded token payload
 * @throws {jwt.JsonWebTokenError} If token is invalid
 * @throws {jwt.TokenExpiredError} If token has expired
 * 
 * @example
 * try {
 *   const payload = verifyAccessToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 *   console.log(payload.userId); // 'user_123'
 * } catch (error) {
 *   console.error('Invalid token:', error.message);
 * }
 */
export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, jwtConfig.secret) as JWTPayload;
}

/**
 * Verifies and decodes a refresh token
 * @param {string} token - JWT refresh token to verify
 * @returns {JWTPayload} Decoded token payload
 * @throws {jwt.JsonWebTokenError} If token is invalid
 * @throws {jwt.TokenExpiredError} If token has expired
 * 
 * @example
 * try {
 *   const payload = verifyRefreshToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 *   console.log(payload.userId); // 'user_123'
 * } catch (error) {
 *   console.error('Invalid refresh token:', error.message);
 * }
 */
export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, jwtConfig.refreshSecret) as JWTPayload;
}

/**
 * Generates both access and refresh tokens for a user
 * @param {Object} payload - User data to include in tokens
 * @param {string} payload.userId - User's unique identifier
 * @param {string} payload.email - User's email address
 * @param {string} payload.role - User's role
 * @returns {Object} Object containing both access and refresh tokens
 * 
 * @example
 * const tokens = generateTokens({
 *   userId: 'user_123',
 *   email: 'user@example.com',
 *   role: 'individual'
 * });
 * console.log(tokens.accessToken); // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 * console.log(tokens.refreshToken); // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 */
export function generateTokens(payload: Omit<JWTPayload, 'type' | 'iat' | 'exp'>) {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload)
  };
} 