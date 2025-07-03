/**
 * @fileoverview Products seed data
 * @description Seeds the products table with comprehensive product data including
 * various egg types with role-based pricing and inventory tracking for both B2C and B2B customers.
 */

import { Knex } from "knex";
import { Product } from "../../../shared/types/product";

/**
 * Product data interface for seeding
 * @interface ProductSeedData
 * @description Defines the structure for product seed data
 */

/**
 * Seed function to populate products table
 * @function seed
 * @description Seeds the products table with comprehensive product data including:
 * - Commodity eggs (white and brown)
 * - Organic eggs (white and brown)
 * - Cage-free eggs (white and brown)
 * - Specialty eggs (duck, quail, hard-boiled)
 * - Pasture-raised eggs
 * - Heirloom eggs (blue and brown)
 *
 * Each product includes:
 * - Role-based pricing (B2C and B2B)
 * - Separate inventory tracking (by carton and by box)
 * - Detailed product information
 * - Proper image URLs matching asset structure
 *
 * @param {Knex} knex - Knex instance
 * @returns {Promise<void>}
 *
 * @example
 * // Run this seed
 * npx knex seed:run
 *
 * // Run specific seed
 * npx knex seed:run --specific=001_products.ts
 */
export async function seed(knex: Knex): Promise<void> {
  // Clear existing data
  await knex("products").del();

  const products: Product[] = [
    // Commodity White Eggs
    {
      id: 101,
      name: "Commodity White Eggs - 12 Count",
      description:
        "Fresh commodity white eggs, 12 count carton. Perfect for everyday cooking and baking.",
      category: "commodity",
      eggColor: "white",
      eggCount: 12,
      imageUrl: "/assets/eggs/Commodity White Eggs/101-commodity.png",
      b2cPrice: 3.99,
      b2bPrice: 2.99,
      inventoryByCarton: 150,
      inventoryByBox: 25,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 102,
      name: "Commodity White Eggs - 18 Count",
      description:
        "Fresh commodity white eggs, 18 count carton. Great value for larger families.",
      category: "commodity",
      eggColor: "white",
      eggCount: 18,
      imageUrl: "/assets/eggs/Commodity White Eggs/102-commodity.png",
      b2cPrice: 5.49,
      b2bPrice: 4.19,
      inventoryByCarton: 120,
      inventoryByBox: 20,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 103,
      name: "Commodity White Eggs - 24 Count",
      description:
        "Fresh commodity white eggs, 24 count carton. Ideal for restaurants and food service.",
      category: "commodity",
      eggColor: "white",
      eggCount: 24,
      imageUrl: "/assets/eggs/Commodity White Eggs/103-commodity.png",
      b2cPrice: 6.99,
      b2bPrice: 5.29,
      inventoryByCarton: 100,
      inventoryByBox: 15,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 104,
      name: "Commodity White Eggs - 30 Count",
      description:
        "Fresh commodity white eggs, 30 count carton. Perfect for high-volume cooking.",
      category: "commodity",
      eggColor: "white",
      eggCount: 30,
      imageUrl: "/assets/eggs/Commodity White Eggs/104-commodity.png",
      b2cPrice: 8.49,
      b2bPrice: 6.49,
      inventoryByCarton: 80,
      inventoryByBox: 12,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 105,
      name: "Commodity White Eggs - 36 Count",
      description:
        "Fresh commodity white eggs, 36 count carton. Great for commercial kitchens.",
      category: "commodity",
      eggColor: "white",
      eggCount: 36,
      imageUrl: "/assets/eggs/Commodity White Eggs/105-commodity.png",
      b2cPrice: 9.99,
      b2bPrice: 7.69,
      inventoryByCarton: 60,
      inventoryByBox: 10,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 106,
      name: "Commodity White Eggs - 48 Count",
      description:
        "Fresh commodity white eggs, 48 count carton. Maximum value for bulk purchases.",
      category: "commodity",
      eggColor: "white",
      eggCount: 48,
      imageUrl: "/assets/eggs/Commodity White Eggs/106-commodity.png",
      b2cPrice: 12.99,
      b2bPrice: 9.99,
      inventoryByCarton: 40,
      inventoryByBox: 8,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 109,
      name: "Commodity White Eggs - 60 Count",
      description:
        "Fresh commodity white eggs, 60 count carton. Ultimate bulk option for commercial use.",
      category: "commodity",
      eggColor: "white",
      eggCount: 60,
      imageUrl: "/assets/eggs/Commodity White Eggs/109-commodity.png",
      b2cPrice: 15.99,
      b2bPrice: 12.49,
      inventoryByCarton: 30,
      inventoryByBox: 6,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 110,
      name: "Commodity White Eggs - 72 Count",
      description:
        "Fresh commodity white eggs, 72 count carton. Premium bulk option for large operations.",
      category: "commodity",
      eggColor: "white",
      eggCount: 72,
      imageUrl: "/assets/eggs/Commodity White Eggs/110-commodity.png",
      b2cPrice: 18.99,
      b2bPrice: 14.99,
      inventoryByCarton: 25,
      inventoryByBox: 5,
      isAvailable: true,
      isActive: true,
    },

    // Commodity Brown Eggs
    {
      id: 111,
      name: "Commodity Brown Eggs - 12 Count",
      description:
        "Fresh commodity brown eggs, 12 count carton. Rich flavor and golden yolks.",
      category: "commodity",
      eggColor: "brown",
      eggCount: 12,
      imageUrl: "/assets/eggs/Commodity Brown Eggs/111-commodity.png",
      b2cPrice: 4.49,
      b2bPrice: 3.39,
      inventoryByCarton: 120,
      inventoryByBox: 20,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 112,
      name: "Commodity Brown Eggs - 18 Count",
      description:
        "Fresh commodity brown eggs, 18 count carton. Perfect for families who prefer brown eggs.",
      category: "commodity",
      eggColor: "brown",
      eggCount: 18,
      imageUrl: "/assets/eggs/Commodity Brown Eggs/112-commodity.png",
      b2cPrice: 6.19,
      b2bPrice: 4.79,
      inventoryByCarton: 100,
      inventoryByBox: 15,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 113,
      name: "Commodity Brown Eggs - 24 Count",
      description:
        "Fresh commodity brown eggs, 24 count carton. Great for restaurants and bakeries.",
      category: "commodity",
      eggColor: "brown",
      eggCount: 24,
      imageUrl: "/assets/eggs/Commodity Brown Eggs/113-commodity.png",
      b2cPrice: 7.89,
      b2bPrice: 6.09,
      inventoryByCarton: 80,
      inventoryByBox: 12,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 114,
      name: "Commodity Brown Eggs - 30 Count",
      description:
        "Fresh commodity brown eggs, 30 count carton. Ideal for high-volume commercial use.",
      category: "commodity",
      eggColor: "brown",
      eggCount: 30,
      imageUrl: "/assets/eggs/Commodity Brown Eggs/114-commodity.png",
      b2cPrice: 9.59,
      b2bPrice: 7.39,
      inventoryByCarton: 60,
      inventoryByBox: 10,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 115,
      name: "Commodity Brown Eggs - 36 Count",
      description:
        "Fresh commodity brown eggs, 36 count carton. Perfect for large commercial kitchens.",
      category: "commodity",
      eggColor: "brown",
      eggCount: 36,
      imageUrl: "/assets/eggs/Commodity Brown Eggs/115-commodity.png",
      b2cPrice: 11.29,
      b2bPrice: 8.79,
      inventoryByCarton: 50,
      inventoryByBox: 8,
      isAvailable: true,
      isActive: true,
    },

    // Organic Brown Eggs
    {
      id: 121,
      name: "Organic Brown Eggs - 12 Count",
      description:
        "Certified organic brown eggs, 12 count carton. Free-range, no antibiotics or hormones.",
      category: "organic",
      eggColor: "brown",
      eggCount: 12,
      imageUrl: "/assets/eggs/Organic Brown Eggs/121-organic.png",
      b2cPrice: 6.99,
      b2bPrice: 5.29,
      inventoryByCarton: 80,
      inventoryByBox: 15,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 122,
      name: "Organic Brown Eggs - 18 Count",
      description:
        "Certified organic brown eggs, 18 count carton. Premium quality for health-conscious consumers.",
      category: "organic",
      eggColor: "brown",
      eggCount: 18,
      imageUrl: "/assets/eggs/Organic Brown Eggs/122-organic.png",
      b2cPrice: 9.99,
      b2bPrice: 7.69,
      inventoryByCarton: 60,
      inventoryByBox: 12,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 123,
      name: "Organic Brown Eggs - 24 Count",
      description:
        "Certified organic brown eggs, 24 count carton. Perfect for organic restaurants and cafes.",
      category: "organic",
      eggColor: "brown",
      eggCount: 24,
      imageUrl: "/assets/eggs/Organic Brown Eggs/123-organic.png",
      b2cPrice: 12.99,
      b2bPrice: 9.99,
      inventoryByCarton: 50,
      inventoryByBox: 10,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 125,
      name: "Organic Brown Eggs - 30 Count",
      description:
        "Certified organic brown eggs, 30 count carton. Ideal for organic food service operations.",
      category: "organic",
      eggColor: "brown",
      eggCount: 30,
      imageUrl: "/assets/eggs/Organic Brown Eggs/125-organic.png",
      b2cPrice: 15.99,
      b2bPrice: 12.49,
      inventoryByCarton: 40,
      inventoryByBox: 8,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 126,
      name: "Organic Brown Eggs - 36 Count",
      description:
        "Certified organic brown eggs, 36 count carton. Premium bulk option for organic establishments.",
      category: "organic",
      eggColor: "brown",
      eggCount: 36,
      imageUrl: "/assets/eggs/Organic Brown Eggs/126-organic.png",
      b2cPrice: 18.99,
      b2bPrice: 14.99,
      inventoryByCarton: 30,
      inventoryByBox: 6,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 127,
      name: "Organic Brown Eggs - 48 Count",
      description:
        "Certified organic brown eggs, 48 count carton. Maximum value for organic bulk purchases.",
      category: "organic",
      eggColor: "brown",
      eggCount: 48,
      imageUrl: "/assets/eggs/Organic Brown Eggs/127-organic.png",
      b2cPrice: 23.99,
      b2bPrice: 18.99,
      inventoryByCarton: 25,
      inventoryByBox: 5,
      isAvailable: true,
      isActive: true,
    },

    // Cage Free Brown Eggs
    {
      id: 131,
      name: "Cage Free Brown Eggs - 12 Count",
      description:
        "Cage-free brown eggs, 12 count carton. Hens raised in spacious, humane conditions.",
      category: "cage-free",
      eggColor: "brown",
      eggCount: 12,
      imageUrl: "/assets/eggs/Cage Free Brown Eggs/131-cage-free.png",
      b2cPrice: 5.49,
      b2bPrice: 4.19,
      inventoryByCarton: 100,
      inventoryByBox: 18,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 132,
      name: "Cage Free Brown Eggs - 18 Count",
      description:
        "Cage-free brown eggs, 18 count carton. Ethical choice for families and businesses.",
      category: "cage-free",
      eggColor: "brown",
      eggCount: 18,
      imageUrl: "/assets/eggs/Cage Free Brown Eggs/132-cage-free.png",
      b2cPrice: 7.99,
      b2bPrice: 6.19,
      inventoryByCarton: 80,
      inventoryByBox: 15,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 133,
      name: "Cage Free Brown Eggs - 24 Count",
      description:
        "Cage-free brown eggs, 24 count carton. Perfect for restaurants with ethical sourcing policies.",
      category: "cage-free",
      eggColor: "brown",
      eggCount: 24,
      imageUrl: "/assets/eggs/Cage Free Brown Eggs/133-cage-free.png",
      b2cPrice: 10.49,
      b2bPrice: 8.19,
      inventoryByCarton: 60,
      inventoryByBox: 12,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 134,
      name: "Cage Free Brown Eggs - 30 Count",
      description:
        "Cage-free brown eggs, 30 count carton. Ideal for food service with humane animal practices.",
      category: "cage-free",
      eggColor: "brown",
      eggCount: 30,
      imageUrl: "/assets/eggs/Cage Free Brown Eggs/134-cage-free.png",
      b2cPrice: 12.99,
      b2bPrice: 10.19,
      inventoryByCarton: 50,
      inventoryByBox: 10,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 135,
      name: "Cage Free Brown Eggs - 36 Count",
      description:
        "Cage-free brown eggs, 36 count carton. Premium bulk option for ethical establishments.",
      category: "cage-free",
      eggColor: "brown",
      eggCount: 36,
      imageUrl: "/assets/eggs/Cage Free Brown Eggs/135-cage-free.png",
      b2cPrice: 15.49,
      b2bPrice: 12.19,
      inventoryByCarton: 40,
      inventoryByBox: 8,
      isAvailable: true,
      isActive: true,
    },

    // Cage Free White Eggs
    {
      id: 136,
      name: "Cage Free White Eggs - 12 Count",
      description:
        "Cage-free white eggs, 12 count carton. Hens raised in spacious, humane conditions.",
      category: "cage-free",
      eggColor: "white",
      eggCount: 12,
      imageUrl: "/assets/eggs/Cage Free White Eggs/136-cage-free.png",
      b2cPrice: 5.19,
      b2bPrice: 3.99,
      inventoryByCarton: 100,
      inventoryByBox: 18,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 137,
      name: "Cage Free White Eggs - 18 Count",
      description:
        "Cage-free white eggs, 18 count carton. Ethical choice for families and businesses.",
      category: "cage-free",
      eggColor: "white",
      eggCount: 18,
      imageUrl: "/assets/eggs/Cage Free White Eggs/137-cage-free.png",
      b2cPrice: 7.69,
      b2bPrice: 5.99,
      inventoryByCarton: 80,
      inventoryByBox: 15,
      isAvailable: true,
      isActive: true,
    },

    // Specialty Eggs
    {
      id: 142,
      name: "Quail Eggs - 12 Count",
      description:
        "Delicate quail eggs, 12 count carton. Perfect for gourmet dishes and specialty cuisine.",
      category: "specialty",
      eggColor: "white",
      eggCount: 12,
      imageUrl: "/assets/eggs/Quail White Eggs/142-copy.png",
      b2cPrice: 8.99,
      b2bPrice: 6.99,
      inventoryByCarton: 30,
      inventoryByBox: 8,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 143,
      name: "Duck Eggs - 12 Count",
      description:
        "Rich duck eggs, 12 count carton. Larger yolks and richer flavor than chicken eggs.",
      category: "specialty",
      eggColor: "white",
      eggCount: 12,
      imageUrl: "/assets/eggs/Duck White Eggs/143-duck.png",
      b2cPrice: 9.99,
      b2bPrice: 7.79,
      inventoryByCarton: 25,
      inventoryByBox: 6,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 145,
      name: "Hard Boiled Eggs - 12 Count",
      description:
        "Pre-cooked hard boiled eggs, 12 count carton. Ready to eat, perfect for snacks and salads.",
      category: "specialty",
      eggColor: "white",
      eggCount: 12,
      imageUrl: "/assets/eggs/Hard Boiled Eggs/145-hard-boiled.png",
      b2cPrice: 7.99,
      b2bPrice: 6.19,
      inventoryByCarton: 40,
      inventoryByBox: 10,
      isAvailable: true,
      isActive: true,
    },

    // Pasture Raised Eggs
    {
      id: 146,
      name: "Pasture Raised Brown Eggs - 12 Count",
      description:
        "Pasture-raised brown eggs, 12 count carton. Hens forage on natural pasture for optimal nutrition.",
      category: "pasture-raised",
      eggColor: "brown",
      eggCount: 12,
      imageUrl: "/assets/eggs/Pasture Raised Brown Eggs/146-pasture.png",
      b2cPrice: 8.99,
      b2bPrice: 6.99,
      inventoryByCarton: 50,
      inventoryByBox: 12,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 147,
      name: "Pasture Raised Brown Eggs - 18 Count",
      description:
        "Pasture-raised brown eggs, 18 count carton. Premium quality with superior nutritional profile.",
      category: "pasture-raised",
      eggColor: "brown",
      eggCount: 18,
      imageUrl: "/assets/eggs/Pasture Raised Brown Eggs/147-pasture.png",
      b2cPrice: 12.99,
      b2bPrice: 10.19,
      inventoryByCarton: 40,
      inventoryByBox: 10,
      isAvailable: true,
      isActive: true,
    },

    // Heirloom Eggs
    {
      id: 148,
      name: "Heirloom Blue Eggs - 12 Count",
      description:
        "Heirloom blue eggs, 12 count carton. Rare heritage breed with beautiful blue shells.",
      category: "heirloom",
      eggColor: "blue",
      eggCount: 12,
      imageUrl: "/assets/eggs/Heirloom Blue & Brown Eggs/148-heirloom-blue.png",
      b2cPrice: 11.99,
      b2bPrice: 9.29,
      inventoryByCarton: 20,
      inventoryByBox: 5,
      isAvailable: true,
      isActive: true,
    },
    {
      id: 149,
      name: "Heirloom Brown Eggs - 12 Count",
      description:
        "Heirloom brown eggs, 12 count carton. Heritage breed with rich flavor and golden yolks.",
      category: "heirloom",
      eggColor: "brown",
      eggCount: 12,
      imageUrl:
        "/assets/eggs/Heirloom Blue & Brown Eggs/149-heirloom-brown.png",
      b2cPrice: 10.99,
      b2bPrice: 8.49,
      inventoryByCarton: 25,
      inventoryByBox: 6,
      isAvailable: true,
      isActive: true,
    },
  ];

  // Insert all products
  await knex("products").insert(products);

  console.log(`✅ Successfully seeded ${products.length} products`);
}
