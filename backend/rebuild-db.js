const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "123",
  database: "postgres", // Connect to default postgres database first
});

async function rebuildDatabase() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL");

    // Drop the database if it exists
    console.log("Dropping existing database...");
    await client.query(`
      SELECT pg_terminate_backend(pid) 
      FROM pg_stat_activity 
      WHERE datname = 'bundleup' AND pid <> pg_backend_pid()
    `);
    await client.query("DROP DATABASE IF EXISTS bundleup");
    console.log('Database "bundleup" dropped successfully!');

    // Create the database
    console.log("Creating new database...");
    await client.query("CREATE DATABASE bundleup");
    console.log('Database "bundleup" created successfully!');

    console.log("✅ Database rebuild completed!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.end();
  }
}

rebuildDatabase();
