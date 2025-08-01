const dotenv = require("dotenv");
const path = require("path");

// Load the .env file the same way knex does
dotenv.config({ path: path.join(__dirname, "src", ".env") });

console.log("Environment variables:");
console.log("PG_HOST:", process.env.PG_HOST);
console.log("PG_PORT:", process.env.PG_PORT);
console.log("PG_DB:", process.env.PG_DB);
console.log("PG_USER:", process.env.PG_USER);
console.log(
  "PG_PASS:",
  process.env.PG_PASS ? "***" + process.env.PG_PASS.slice(-3) : "undefined"
);

// Test database connection
const { Client } = require("pg");

const client = new Client({
  host: process.env.PG_HOST || "localhost",
  port: parseInt(process.env.PG_PORT || "5432"),
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASS || "postgres",
  database: process.env.PG_DB || "bundleup",
});

async function testConnection() {
  try {
    await client.connect();
    console.log("✅ Database connection successful!");
    await client.end();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
}

testConnection();
