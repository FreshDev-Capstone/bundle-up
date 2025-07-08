import jwt from "jsonwebtoken";

export interface JWTConfig {
  secret: string;
  refreshSecret: string;
  accessTokenExpiry: number;
  refreshTokenExpiry: number;
  expiresIn: string;
}

export const jwtConfig: JWTConfig = {
  secret: process.env.JWT_SECRET || "your-secret-key",
  refreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
  accessTokenExpiry: parseInt(process.env.JWT_ACCESS_EXPIRY || "3600"),
  refreshTokenExpiry: parseInt(process.env.JWT_REFRESH_EXPIRY || "2592000"),
  expiresIn: process.env.JWT_EXPIRES_IN || "1h",
};

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  type: "access" | "refresh";
  iat?: number;
  exp?: number;
}

export function generateAccessToken(
  payload: Omit<JWTPayload, "type" | "iat" | "exp">
): string {
  return jwt.sign({ ...payload, type: "access" }, jwtConfig.secret, {
    expiresIn: jwtConfig.accessTokenExpiry,
  });
}

export function generateRefreshToken(
  payload: Omit<JWTPayload, "type" | "iat" | "exp">
): string {
  return jwt.sign({ ...payload, type: "refresh" }, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshTokenExpiry,
  });
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, jwtConfig.secret) as JWTPayload;
}

export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, jwtConfig.refreshSecret) as JWTPayload;
}

export function generateTokens(
  payload: Omit<JWTPayload, "type" | "iat" | "exp">
) {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}
