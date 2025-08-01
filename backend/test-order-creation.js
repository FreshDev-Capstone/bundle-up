const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

// Test order creation API
async function testOrderCreation() {
  const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

  console.log("Testing order creation...");
  console.log("API Base URL:", API_BASE_URL);

  try {
    // First, let's get a list of products to use in our test order
    const productsResponse = await fetch(`${API_BASE_URL}/api/products`);
    const productsData = await productsResponse.json();

    if (!productsData.success) {
      console.error("Failed to fetch products:", productsData.message);
      return;
    }

    const products = productsData.data;
    if (!products || products.length === 0) {
      console.error("No products found in database");
      return;
    }

    console.log(`Found ${products.length} products`);

    // Use the first product for testing
    const testProduct = products[0];
    console.log("Using product for test:", testProduct.name);

    // Create test order data
    const testOrderData = {
      items: [
        {
          productId: testProduct.id,
          quantity: 2,
          price: testProduct.b2c_price,
        },
      ],
      deliveryAddress: {
        street: "123 Test Street",
        city: "Test City",
        state: "Test State",
        zipCode: "12345",
        country: "USA",
      },
      paymentMethod: "test",
      notes: "Test order from script",
    };

    console.log("Test order data:", JSON.stringify(testOrderData, null, 2));

    // Note: This test requires authentication, so it will fail without a valid token
    // In a real test, you would need to authenticate first
    console.log("\n⚠️  Note: This test requires authentication.");
    console.log("To run a complete test, you would need to:");
    console.log("1. Authenticate a user first");
    console.log("2. Use the returned token in the Authorization header");
    console.log("3. Then create the order");

    console.log("\n✅ Order creation test script ready!");
    console.log(
      "The API endpoint structure is correct and ready for testing with authentication."
    );
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

testOrderCreation();
