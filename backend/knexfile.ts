import { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the src directory
dotenv.config({ path: path.join(__dirname, 'src', '.env') });

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.PG_HOST || 'localhost',
      port: parseInt(process.env.PG_PORT || '5432'),
      database: process.env.PG_DB || 'bundleup',
      user: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASS || 'postgres'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: '../db/migrations'
    },
    seeds: {
      directory: '../db/seeds'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT || '5432'),
      database: process.env.PG_DB,
      user: process.env.PG_USER,
      password: process.env.PG_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: '../db/migrations'
    },
    seeds: {
      directory: '../db/seeds'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT || '5432'),
      database: process.env.PG_DB,
      user: process.env.PG_USER,
      password: process.env.PG_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: '../db/migrations'
    },
    seeds: {
      directory: '../db/seeds'
    }
  }
};

export default config; 