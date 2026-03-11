import type { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

if (!process.env['DATABASE_URL'] && !process.env['DATABASE_HOST']) {
  dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
}

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: process.env['DATABASE_URL'] ?? {
      host: process.env['DATABASE_HOST'] ?? 'localhost',
      port: Number(process.env['DATABASE_PORT'] ?? 5432),
      database: process.env['DATABASE_NAME'] ?? 'bundleup_dev',
      user: process.env['DATABASE_USER'] ?? 'postgres',
      password: process.env['DATABASE_PASSWORD'] ?? 'password',
    },
    migrations: {
      directory: '../migrations',
      extension: 'ts',
    },
    seeds: {
      directory: '../seeds',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

  test: {
    client: 'pg',
    connection: process.env['DATABASE_URL'] ?? {
      host: process.env['DATABASE_HOST'] ?? 'localhost',
      port: Number(process.env['DATABASE_PORT'] ?? 5432),
      database: process.env['DATABASE_NAME'] ?? 'bundleup_test',
      user: process.env['DATABASE_USER'] ?? 'postgres',
      password: process.env['DATABASE_PASSWORD'] ?? 'password',
    },
    migrations: {
      directory: '../migrations',
      extension: 'ts',
    },
    seeds: {
      directory: '../seeds',
    },
  },

  production: {
    client: 'pg',
    connection: process.env['DATABASE_URL'],
    migrations: {
      directory: '../migrations',
    },
    seeds: {
      directory: '../seeds',
    },
    pool: {
      min: 2,
      max: 20,
    },
  },
};

export default config;
module.exports = config;
