const fs = require("fs");
const path = require("path");

const envContent = `# Database Configuration
PG_HOST=localhost
PG_PORT=5432
PG_DB=bundleup
PG_USER=postgres
PG_PASS=postgres

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
`;

const envPath = path.join(__dirname, "src", ".env");

try {
  fs.writeFileSync(envPath, envContent);
  console.log("✅ .env file created successfully at:", envPath);
  console.log("📝 Database password set to: 123");
} catch (error) {
  console.error("❌ Error creating .env file:", error.message);
}
