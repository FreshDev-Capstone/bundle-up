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
};

async function createProductsTable() {
  const db = knex(knexConfig);

  try {
    console.log("Creating products table...");

    await db.schema.createTable("products", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.text("description");
      table.string("category").notNullable();
      table.string("product_color");
      table.integer("product_count").notNullable();
      table.string("imageUrl");
      table.decimal("b2cPrice", 10, 2).notNullable();
      table.decimal("b2bPrice", 10, 2).notNullable();
      table.integer("inventoryByCarton").defaultTo(0);
      table.integer("inventoryByBox").defaultTo(0);
      table.boolean("isAvailable").defaultTo(true);
      table.boolean("isActive").defaultTo(true);
      table.timestamps(true, true); // created_at, updated_at

      table.index("category");
      table.index("product_color");
      table.index("product_count");
      table.index("isAvailable");
      table.index("isActive");
    });

    console.log("✅ Products table created successfully!");

    // Add sample products
    console.log("Adding sample products...");
    const sampleProducts = [
      {
        name: "Organic Brown Eggs",
        description: "Fresh organic brown eggs from free-range chickens",
        category: "Organic",
        product_color: "Brown",
        product_count: 12,
        imageUrl:
          "https://via.placeholder.com/300x300/E3E3E3/999999?text=Organic+Brown+Eggs",
        b2cPrice: 4.99,
        b2bPrice: 3.99,
        inventoryByCarton: 50,
        inventoryByBox: 200,
        isAvailable: true,
        isActive: true,
      },
      {
        name: "Cage-Free White Eggs",
        description: "Premium cage-free white eggs",
        category: "Cage-Free",
        product_color: "White",
        product_count: 12,
        imageUrl:
          "https://via.placeholder.com/300x300/E3E3E3/999999?text=Cage-Free+White+Eggs",
        b2cPrice: 3.99,
        b2bPrice: 2.99,
        inventoryByCarton: 75,
        inventoryByBox: 300,
        isAvailable: true,
        isActive: true,
      },
      {
        name: "Pasture Raised Brown Eggs",
        description: "Pasture-raised brown eggs with rich yolks",
        category: "Pasture-Raised",
        product_color: "Brown",
        product_count: 12,
        imageUrl:
          "https://via.placeholder.com/300x300/E3E3E3/999999?text=Pasture+Raised+Brown+Eggs",
        b2cPrice: 6.99,
        b2bPrice: 5.99,
        inventoryByCarton: 25,
        inventoryByBox: 100,
        isAvailable: true,
        isActive: true,
      },
    ];

    for (const product of sampleProducts) {
      await db("products").insert(product);
      console.log(`Added product: ${product.name}`);
    }

    console.log("✅ Sample products added!");
  } catch (error) {
    console.error("❌ Failed to create products table:", error.message);
  } finally {
    await db.destroy();
  }
}

createProductsTable();
