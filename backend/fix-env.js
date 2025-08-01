const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "src", ".env");

try {
  let envContent = fs.readFileSync(envPath, "utf8");

  // Replace the DATABASE_URL with the correct password
  envContent = envContent.replace(
    "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bundleup",
    "DATABASE_URL=postgresql://postgres:123@localhost:5432/bundleup"
  );

  fs.writeFileSync(envPath, envContent);
  console.log("✅ Fixed DATABASE_URL in .env file");
  console.log("Updated to: postgresql://postgres:123@localhost:5432/bundleup");
} catch (error) {
  console.error("❌ Error updating .env file:", error.message);
}
