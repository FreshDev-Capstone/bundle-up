import Knex from 'knex';
import knexConfig from './knexfile';

const env = process.env['NODE_ENV'] ?? 'development';
const config = knexConfig[env];

if (!config) {
  throw new Error(`No database config found for environment: ${env}`);
}

const db = Knex(config);

export default db;
