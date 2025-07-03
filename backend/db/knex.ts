/**
 * @fileoverview Knex database connection configuration
 * @description Centralized database connection setup using Knex.js with PostgreSQL.
 * Provides the main database connection instance for all database operations.
 */

import knex from 'knex';
import { knexConfig } from '../src/config/database';

/**
 * Knex database instance
 * @type {knex.Knex}
 * @description Main database connection instance configured with PostgreSQL
 * 
 * @example
 * // Query users table
 * const users = await db('users').select('*');
 * 
 * // Insert new user
 * const [newUser] = await db('users').insert(userData).returning('*');
 * 
 * // Update user
 * await db('users').where({ id: userId }).update(updateData);
 * 
 * // Delete user
 * await db('users').where({ id: userId }).del();
 */
const db = knex(knexConfig);

/**
 * Tests the database connection
 * @function testConnection
 * @description Verifies that the database connection is working properly
 * 
 * @returns {Promise<boolean>} True if connection is successful, false otherwise
 * 
 * @example
 * const isConnected = await testConnection();
 * if (isConnected) {
 *   console.log('Database connection successful');
 * } else {
 *   console.error('Database connection failed');
 * }
 */
export async function testConnection(): Promise<boolean> {
  try {
    await db.raw('SELECT 1');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

/**
 * Closes the database connection
 * @function closeConnection
 * @description Properly closes the database connection pool
 * 
 * @returns {Promise<void>}
 * 
 * @example
 * // Close connection when shutting down
 * await closeConnection();
 */
export async function closeConnection(): Promise<void> {
  try {
    await db.destroy();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
  }
}

export default db; 