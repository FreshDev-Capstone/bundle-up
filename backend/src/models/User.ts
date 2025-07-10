import knex from "../../db/knex";

export interface User {
  id: string; // UUID from database
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string; // Optional for B2C users
  googleId?: string;
  passwordHash?: string;
  role: "admin" | "b2c" | "b2b";
  isEmailVerified: boolean;
  emailVerifiedAt?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string; // Optional for B2C users
  role?: "admin" | "b2c" | "b2b";
  googleId?: string;
  passwordHash?: string;
  isEmailVerified?: boolean;
  emailVerifiedAt?: Date;
}

export class User implements User {
  static async create(userData: CreateUserData): Promise<User> {
    const [user] = await knex("users")
      .insert({
        ...userData,
        role: userData.role || "b2c",
        isEmailVerified: userData.isEmailVerified || false,
      })
      .returning("*");

    return user;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const user = await knex("users").where({ email }).first();
    return user || null;
  }

  static async findByGoogleId(googleId: string): Promise<User | null> {
    const user = await knex("users").where({ googleId }).first();
    return user || null;
  }

  static async linkGoogleAccount(
    userId: string,
    googleId: string
  ): Promise<User> {
    const [user] = await knex("users")
      .where({ id: userId })
      .update({
        googleId,
        updatedAt: new Date(),
      })
      .returning("*");

    return user;
  }

  static async findById(id: string): Promise<User | null> {
    const user = await knex("users").where({ id }).first();
    return user || null;
  }

  static async updateLastLogin(id: string): Promise<void> {
    await knex("users").where({ id }).update({
      lastLoginAt: new Date(),
      updated_at: new Date(),
    });
  }

  static async verifyEmail(id: string): Promise<void> {
    await knex("users").where({ id }).update({
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    });
  }

  static async updateProfile(id: string, data: Partial<User>): Promise<User> {
    const [user] = await knex("users")
      .where({ id })
      .update({
        ...data,
        updated_at: new Date(),
      })
      .returning("*");

    return user;
  }

  static async isAdminEmail(email: string): Promise<boolean> {
    return email.endsWith("@naturalfoodsinc.com");
  }

  static async getUsersByRole(role: "admin" | "b2c" | "b2b"): Promise<User[]> {
    return knex("users").where({ role }).orderBy("createdAt", "desc");
  }
}
