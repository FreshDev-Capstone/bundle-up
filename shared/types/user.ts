// User related types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "b2c" | "b2b";
  accountType: "ADMIN" | "B2C" | "B2B";
  googleId?: string;
  isEmailVerified: boolean;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  role?: "admin" | "b2c" | "b2b";
  googleId?: string;
  passwordHash?: string;
  isEmailVerified?: boolean;
  emailVerifiedAt?: string;
}
