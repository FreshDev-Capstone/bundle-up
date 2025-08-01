const { Client } = require("pg");

// This script will help you create the bundleup database
// You'll need to update the password to match your PostgreSQL password

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "postgres", // Replace with your actual password
  database: "postgres", // Connect to default postgres database first
});

async function createDatabase() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL");

    // Check if database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'bundleup'"
    );

    if (result.rows.length === 0) {
      // Create the database
      await client.query("CREATE DATABASE bundleup");
      console.log('Database "bundleup" created successfully!');
    } else {
      console.log('Database "bundleup" already exists!');
    }
  } catch (error) {
    console.error("Error:", error.message);
    console.log("\nMake sure to:");
    console.log(
      '1. Replace "YOUR_PASSWORD_HERE" with your actual PostgreSQL password'
    );
    console.log("2. PostgreSQL service is running");
  } finally {
    await client.end();
  }
}

createDatabase();
