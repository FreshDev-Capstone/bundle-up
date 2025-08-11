import knex from "../../db/knex";
import { User as UserType } from "../../../shared/types/user";

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

export class UserModel {
  // Map DB (snake_case) to TS (camelCase)
  static fromDb(db: any): UserType {
    return {
      id: db.id,
      companyName: db.company_name,
      firstName: db.first_name,
      lastName: db.last_name,
      email: db.email,
      passwordHash: db.password_hash,
      role: db.role,
      googleId: db.google_id,
      isEmailVerified: db.is_email_verified,
      emailVerifiedAt: db.email_verified_at,
      lastLoginAt: db.last_login_at,
      createdAt: db.created_at,
      updatedAt: db.updated_at,
    };
  }

  static async create(userData: CreateUserData): Promise<UserType> {
    // Map camelCase to snake_case for DB
    const dbUser = {
      company_name: userData.companyName,
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      password_hash: userData.passwordHash,
      role: userData.role || "b2c",
      google_id: userData.googleId,
      is_email_verified: userData.isEmailVerified || false,
      email_verified_at: userData.emailVerifiedAt,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const [created] = await knex("user").insert(dbUser).returning("*");
    return UserModel.fromDb(created);
  }

  static async findByEmail(email: string): Promise<UserType | null> {
    const user = await knex("user").where({ email }).first();
    return user ? UserModel.fromDb(user) : null;
  }

  static async findByGoogleId(googleId: string): Promise<UserType | null> {
    const user = await knex("user").where({ google_id: googleId }).first();
    return user ? UserModel.fromDb(user) : null;
  }

  static async findById(id: string): Promise<UserType | null> {
    const user = await knex("user").where({ id }).first();
    return user ? UserModel.fromDb(user) : null;
  }

  static async updateLastLogin(id: string): Promise<void> {
    await knex("user").where({ id }).update({
      last_login_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  static async linkGoogleAccount(id: string, googleId: string): Promise<void> {
    await knex("user").where({ id }).update({
      google_id: googleId,
      updated_at: new Date().toISOString(),
    });
  }

  static async updateProfile(
    id: string,
    data: Partial<UserType>
  ): Promise<UserType | null> {
    const dbData: any = {};
    if (data.companyName !== undefined) dbData.company_name = data.companyName;
    if (data.firstName !== undefined) dbData.first_name = data.firstName;
    if (data.lastName !== undefined) dbData.last_name = data.lastName;
    if (data.email !== undefined) dbData.email = data.email;
    if (data.passwordHash !== undefined)
      dbData.password_hash = data.passwordHash;
    if (data.role !== undefined) dbData.role = data.role;
    if (data.googleId !== undefined) dbData.google_id = data.googleId;
    if (data.isEmailVerified !== undefined)
      dbData.is_email_verified = data.isEmailVerified;
    if (data.emailVerifiedAt !== undefined)
      dbData.email_verified_at = data.emailVerifiedAt;
    if (data.lastLoginAt !== undefined) dbData.last_login_at = data.lastLoginAt;
    dbData.updated_at = new Date().toISOString();

    const [updated] = await knex("user")
      .where({ id })
      .update(dbData)
      .returning("*");
    return updated ? UserModel.fromDb(updated) : null;
  }

  static async delete(id: string): Promise<number> {
    return await knex("user").where({ id }).del();
  }

  static isAdminEmail(email: string): boolean {
    return email.endsWith("@naturalfoodsinc.com");
  }

  static async getUsersByRole(
    role: "admin" | "b2c" | "b2b"
  ): Promise<UserType[]> {
    const users = await knex("user")
      .where({ role })
      .orderBy("created_at", "desc");
    return users.map(UserModel.fromDb);
  }

  // Get all users (admin only)
  static async getAll(): Promise<UserType[]> {
    const users = await knex("user").orderBy("created_at", "desc");
    return users.map(UserModel.fromDb);
  }
}
