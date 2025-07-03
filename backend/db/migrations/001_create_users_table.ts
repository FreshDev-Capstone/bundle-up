/**
 * @fileoverview Users table migration
 * @description Creates the users table with all necessary fields for user management,
 * authentication, and role-based access control.
 */

import { Knex } from 'knex';

/**
 * Migration function to create users table
 * @function up
 * @description Creates the users table with the following structure:
 * - id: UUID primary key
 * - email: Unique email address
 * - firstName: User's first name
 * - lastName: User's last name
 * - role: User role (admin, individual, b2b)
 * - googleId: Google OAuth ID (optional)
 * - passwordHash: Hashed password (optional for Google-only users)
 * - isEmailVerified: Email verification status
 * - emailVerifiedAt: Email verification timestamp
 * - lastLoginAt: Last login timestamp
 * - createdAt: Record creation timestamp
 * - updatedAt: Record update timestamp
 * 
 * @param {Knex} knex - Knex instance
 * @returns {Promise<void>}
 * 
 * @example
 * // Run this migration
 * npx knex migrate:latest
 * 
 * // Rollback this migration
 * npx knex migrate:rollback
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // User identification
    table.string('email').unique().notNullable();
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    
    // Role-based access control
    table.enum('role', ['admin', 'b2c', 'b2b']).defaultTo('b2c');
    
    // Authentication fields
    table.string('googleId').unique(); // Google OAuth ID
    table.string('passwordHash'); // Hashed password (optional for Google-only users)
    
    // Email verification
    table.boolean('isEmailVerified').defaultTo(false);
    table.timestamp('emailVerifiedAt');
    
    // Activity tracking
    table.timestamp('lastLoginAt');
    
    // Timestamps
    table.timestamps(true, true); // createdAt, updatedAt
    
    // Indexes for performance
    table.index('email');
    table.index('role');
    table.index('googleId');
    table.index('createdAt');
  });
}

/**
 * Migration rollback function
 * @function down
 * @description Drops the users table
 * 
 * @param {Knex} knex - Knex instance
 * @returns {Promise<void>}
 * 
 * @example
 * // Rollback this migration
 * npx knex migrate:rollback
 */
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
} 