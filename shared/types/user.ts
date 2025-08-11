// User related types
export interface User {
  id: string;
  companyName?: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash?: string;
  role: "admin" | "b2c" | "b2b";
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
  companyName?: string;
  role?: "admin" | "b2c" | "b2b";
  googleId?: string;
  passwordHash?: string;
  isEmailVerified?: boolean;
  emailVerifiedAt?: string;
}
