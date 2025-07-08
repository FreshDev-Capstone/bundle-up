import { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";
import { knexConfig } from "./src/config/database";

dotenv.config({ path: path.join(__dirname, "src", ".env") });

export default {
  development: knexConfig,
  production: knexConfig,
  test: {
    ...knexConfig,
    connection: {
      ...knexConfig.connection,
      database: process.env.PG_DB_TEST || "bundleup_test",
    },
  },
};
