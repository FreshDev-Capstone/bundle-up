const dotenv = require("dotenv");
const path = require("path");
const knex = require("knex");

// Load the .env file
dotenv.config({ path: path.join(__dirname, "src", ".env") });

const knexConfig = {
  client: "postgresql",
  connection: {
    host: process.env.PG_HOST || "localhost",
    port: parseInt(process.env.PG_PORT || "5432"),
    database: process.env.PG_DB || "bundleup",
    user: process.env.PG_USER || "postgres",
    password: process.env.PG_PASS || "postgres",
  },
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

const db = knex(knexConfig);

async function runMigrations() {
  try {
    console.log("Running migrations...");
    await db.migrate.latest();
    console.log("✅ Migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
  } finally {
    await db.destroy();
  }
}

runMigrations();
