const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "src", ".env");

try {
  let envContent = fs.readFileSync(envPath, "utf8");

  // Check if PG_PASS already exists
  if (!envContent.includes("PG_PASS=")) {
    // Add PG_PASS after PG_USER
    envContent = envContent.replace(
      "PG_USER=postgres",
      "PG_USER=postgres\nPG_PASS=123"
    );

    fs.writeFileSync(envPath, envContent);
    console.log("✅ Added PG_PASS=123 to .env file");
  } else {
    console.log("✅ PG_PASS already exists in .env file");
  }

  console.log("📝 Database configuration should now work with password: 123");
} catch (error) {
  console.error("❌ Error updating .env file:", error.message);
}
