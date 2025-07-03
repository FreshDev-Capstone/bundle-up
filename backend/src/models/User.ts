/**
 * @fileoverview User model and database operations
 * @description Defines the User interface and provides database operations for user management.
 * Handles user creation, authentication, profile updates, and role-based operations.
 */

import knex from '../../db/knex';

/**
 * User interface representing a user in the system
 * @interface User
 * @description Defines the structure of a user object with all required and optional properties
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** User's email address (unique) */
  email: string;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's role in the system */
  role: 'admin' | 'b2c' | 'b2b';
  /** Google OAuth ID (optional) */
  googleId?: string;
  /** Hashed password (optional for Google-only users) */
  passwordHash?: string;
  /** Whether the user's email has been verified */
  isEmailVerified: boolean;
  /** Timestamp when email was verified */
  emailVerifiedAt?: Date;
  /** Timestamp of last login */
  lastLoginAt?: Date;
  /** Timestamp when user was created */
  createdAt: Date;
  /** Timestamp when user was last updated */
  updatedAt: Date;
}

/**
 * Interface for creating a new user
 * @interface CreateUserData
 * @description Defines the data structure required to create a new user
 */
export interface CreateUserData {
  /** User's email address */
  email: string;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's role (defaults to 'b2c') */
  role?: 'admin' | 'b2c' | 'b2b';
  /** Google OAuth ID */
  googleId?: string;
  /** Hashed password */
  passwordHash?: string;
  /** Whether email is verified */
  isEmailVerified?: boolean;
  /** Email verification timestamp */
  emailVerifiedAt?: Date;
}

/**
 * User model class providing database operations
 * @class UserModel
 * @description Static methods for user-related database operations
 */
export class UserModel {
  /**
   * Creates a new user in the database
   * @param {CreateUserData} userData - User data for creation
   * @returns {Promise<User>} The created user object
   * 
   * @example
   * const newUser = await UserModel.create({
   *   email: 'user@example.com',
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   role: 'b2c'
   * });
   */
  static async create(userData: CreateUserData): Promise<User> {
    const [user] = await knex('users')
      .insert({
        ...userData,
        role: userData.role || 'b2c',
        isEmailVerified: userData.isEmailVerified || false,
      })
      .returning('*');
    
    return user;
  }

  /**
   * Finds a user by their email address
   * @param {string} email - User's email address
   * @returns {Promise<User | null>} User object or null if not found
   * 
   * @example
   * const user = await UserModel.findByEmail('user@example.com');
   */
  static async findByEmail(email: string): Promise<User | null> {
    const user = await knex('users').where({ email }).first();
    return user || null;
  }

  /**
   * Finds a user by their Google OAuth ID
   * @param {string} googleId - Google OAuth ID
   * @returns {Promise<User | null>} User object or null if not found
   * 
   * @example
   * const user = await UserModel.findByGoogleId('google_oauth_id_123');
   */
  static async findByGoogleId(googleId: string): Promise<User | null> {
    const user = await knex('users').where({ googleId }).first();
    return user || null;
  }

  /**
   * Finds a user by their unique ID
   * @param {string} id - User's unique identifier
   * @returns {Promise<User | null>} User object or null if not found
   * 
   * @example
   * const user = await UserModel.findById('user_id_123');
   */
  static async findById(id: string): Promise<User | null> {
    const user = await knex('users').where({ id }).first();
    return user || null;
  }

  /**
   * Updates the last login timestamp for a user
   * @param {string} id - User's unique identifier
   * @returns {Promise<void>}
   * 
   * @example
   * await UserModel.updateLastLogin('user_id_123');
   */
  static async updateLastLogin(id: string): Promise<void> {
    await knex('users')
      .where({ id })
      .update({ lastLoginAt: new Date() });
  }

  /**
   * Marks a user's email as verified
   * @param {string} id - User's unique identifier
   * @returns {Promise<void>}
   * 
   * @example
   * await UserModel.verifyEmail('user_id_123');
   */
  static async verifyEmail(id: string): Promise<void> {
    await knex('users')
      .where({ id })
      .update({ 
        isEmailVerified: true, 
        emailVerifiedAt: new Date() 
      });
  }

  /**
   * Updates a user's profile information
   * @param {string} id - User's unique identifier
   * @param {Partial<User>} data - Partial user data to update
   * @returns {Promise<User>} Updated user object
   * 
   * @example
   * const updatedUser = await UserModel.updateProfile('user_id_123', {
   *   firstName: 'Jane',
   *   lastName: 'Smith'
   * });
   */
  static async updateProfile(id: string, data: Partial<User>): Promise<User> {
    const [user] = await knex('users')
      .where({ id })
      .update({
        ...data,
        updatedAt: new Date()
      })
      .returning('*');
    
    return user;
  }

  /**
   * Checks if an email belongs to an admin user
   * @param {string} email - Email address to check
   * @returns {Promise<boolean>} True if email ends with @naturalfoodsinc.com
   * 
   * @example
   * const isAdmin = await UserModel.isAdminEmail('admin@naturalfoodsinc.com');
   */
  static async isAdminEmail(email: string): Promise<boolean> {
    return email.endsWith('@naturalfoodsinc.com');
  }

  /**
   * Gets all users by a specific role
   * @param {string} role - User role to filter by
   * @returns {Promise<User[]>} Array of users with the specified role
   * 
   * @example
   * const b2cUsers = await UserModel.getUsersByRole('b2c');
   */
  static async getUsersByRole(role: 'admin' | 'b2c' | 'b2b'): Promise<User[]> {
    return knex('users').where({ role }).orderBy('createdAt', 'desc');
  }
} 