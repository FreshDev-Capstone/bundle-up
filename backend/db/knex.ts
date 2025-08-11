import knex from "knex";
import * as dotenv from "dotenv";
import * as path from "path";
import { knexConfig } from "../src/config/database";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", "src", ".env") });

const db = knex(knexConfig);

export async function testConnection(): Promise<boolean> {
  try {
    await db.raw("SELECT 1");
    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

export async function closeConnection(): Promise<void> {
  try {
    await db.destroy();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error closing database connection:", error);
  }
}

export default db;
