/**
 * @fileoverview Products table migration
 * @description Creates the products table with all necessary fields for product management,
 * including role-based pricing, categories, egg colors, counts, and availability tracking.
 */

import { Knex } from 'knex';

/**
 * Migration function to create products table
 * @function up
 * @description Creates the products table with the following structure:
 * - id: Integer primary key (matching image file names)
 * - name: Product name
 * - description: Product description
 * - category: Product category (commodity, organic, cage-free, specialty, pasture-raised, heirloom)
 * - eggColor: Egg color for egg products (brown, white, blue, etc.)
 * - eggCount: Number of eggs in package
 * - imageUrl: Product image URL
 * - b2cPrice: B2C price for individual customers
 * - b2bPrice: B2B price for wholesale customers
 * - inventoryByCarton: Inventory count by carton (B2C tracking)
 * - inventoryByBox: Inventory count by box (B2B tracking)
 * - isAvailable: Product availability status
 * - isActive: Product active status
 * - createdAt: Record creation timestamp
 * - updatedAt: Record update timestamp
 * 
 * @param {Knex} knex - Knex instance
 * @returns {Promise<void>}
 * 
 * @example
 * // Run this migration
 * npx knex migrate:latest
 * 
 * // Rollback this migration
 * npx knex migrate:rollback
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('products', (table) => {
    // Primary key - integer ID matching image file names
    table.integer('id').primary();
    
    // Product information
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.string('category').notNullable();
    table.string('eggColor'); // For egg products (brown, white, blue, etc.)
    table.integer('eggCount').notNullable(); // Number of eggs in package
    table.string('imageUrl').notNullable();
    
    // Pricing
    table.decimal('b2cPrice', 10, 2).notNullable(); // B2C price
    table.decimal('b2bPrice', 10, 2).notNullable(); // B2B price
    
    // Inventory management - separate tracking for B2C and B2B
    table.integer('inventoryByCarton').defaultTo(0); // Inventory by carton (B2C)
    table.integer('inventoryByBox').defaultTo(0); // Inventory by box (B2B)
    
    // Product status
    table.boolean('isAvailable').defaultTo(true);
    table.boolean('isActive').defaultTo(true);
    
    // Timestamps
    table.timestamps(true, true); // createdAt, updatedAt
    
    // Indexes for performance
    table.index('category');
    table.index('eggColor');
    table.index('eggCount');
    table.index('isAvailable');
    table.index('isActive');
    table.index('name');
    table.index('createdAt');
  });
}

/**
 * Migration rollback function
 * @function down
 * @description Drops the products table
 * 
 * @param {Knex} knex - Knex instance
 * @returns {Promise<void>}
 * 
 * @example
 * // Rollback this migration
 * npx knex migrate:rollback
 */
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('products');
} 