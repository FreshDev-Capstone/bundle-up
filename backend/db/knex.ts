import knex from 'knex';
import knexConfigs from '../knexfile';

const env = process.env.NODE_ENV || 'development';
const db = knex(knexConfigs[env]);

export default db; 