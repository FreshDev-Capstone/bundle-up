/**
 * @fileoverview Knex.js configuration file
 * @description Configuration file for Knex.js database migrations and seeds.
 * Defines database connection settings for different environments (development, production, test).
 */

import { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";
import { knexConfig } from "./src/config/database";

// Load environment variables from the src directory
dotenv.config({ path: path.join(__dirname, "src", ".env") });

/**
 * Knex configuration object
 * @type {Object}
 * @description Configuration for all environments using the centralized database config
 *
 * @example
 * // Run migrations
 * npx knex migrate:latest
 *
 * // Run seeds
 * npx knex seed:run
 *
 * // Rollback migrations
 * npx knex migrate:rollback
 *
 * // Create new migration
 * npx knex migrate:make create_users_table
 *
 * // Create new seed
 * npx knex seed:make 001_users
 */
export default {
  /** Development environment configuration */
  development: knexConfig,

  /** Production environment configuration */
  production: knexConfig,

  /** Test environment configuration */
  test: {
    ...knexConfig,
    connection: {
      ...knexConfig.connection,
      database: process.env.PG_DB_TEST || "bundleup_test",
    },
  },
};
