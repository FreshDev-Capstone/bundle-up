/**
 * @fileoverview Database configuration and connection settings
 * @description Centralized database configuration for PostgreSQL connection.
 * Provides database connection settings, Knex configuration, and connection pooling.
 */

/**
 * Database configuration interface
 * @interface DatabaseConfig
 * @description Defines the structure for database connection parameters
 */
export interface DatabaseConfig {
  /** Database host address */
  host: string;
  /** Database port number */
  port: number;
  /** Database name */
  database: string;
  /** Database username */
  user: string;
  /** Database password */
  password: string;
}

/**
 * Database configuration object
 * @type {DatabaseConfig}
 * @description Configuration loaded from environment variables with fallback defaults
 * 
 * @example
 * {
 *   host: 'localhost',
 *   port: 5432,
 *   database: 'bundleup',
 *   user: 'postgres',
 *   password: 'postgres'
 * }
 */
export const databaseConfig: DatabaseConfig = {
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432'),
  database: process.env.PG_DB || 'bundleup',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASS || 'postgres'
};

/**
 * Knex configuration object for database operations
 * @type {Object}
 * @description Complete Knex.js configuration including connection, pooling, and migration settings
 * 
 * @example
 * {
 *   client: 'postgresql',
 *   connection: databaseConfig,
 *   pool: { min: 2, max: 10 },
 *   migrations: { tableName: 'knex_migrations', directory: '../db/migrations' },
 *   seeds: { directory: '../db/seeds' }
 * }
 */
export const knexConfig = {
  /** Database client type */
  client: 'postgresql',
  /** Database connection configuration */
  connection: databaseConfig,
  /** Connection pooling settings */
  pool: {
    /** Minimum number of connections in pool */
    min: 2,
    /** Maximum number of connections in pool */
    max: 10
  },
  /** Migration configuration */
  migrations: {
    /** Name of the migrations table */
    tableName: 'knex_migrations',
    /** Directory containing migration files */
    directory: '../db/migrations'
  },
  /** Seed configuration */
  seeds: {
    /** Directory containing seed files */
    directory: '../db/seeds'
  }
}; 