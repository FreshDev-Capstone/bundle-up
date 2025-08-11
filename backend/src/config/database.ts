export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export const databaseConfig: DatabaseConfig = {
  host: process.env.PG_HOST || "localhost",
  port: parseInt(process.env.PG_PORT || "5432"),
  database: process.env.PG_DB || "bundleup",
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASS || "postgres",
};

export const knexConfig = {
  client: "postgresql",
  connection: process.env.DATABASE_URL || databaseConfig,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};
