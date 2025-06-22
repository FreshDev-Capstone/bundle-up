import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.string('imageUrl').notNullable();
    table.string('category').notNullable(); // Single category for now
    table.string('eggColor').notNullable();
    table.integer('eggCount').notNullable(); // Number of eggs per carton
    table.decimal('price', 10, 2).notNullable(); // Individual price
    table.decimal('wholesalePrice', 10, 2).notNullable(); // B2B price
    table.integer('inventoryByCarton').notNullable().defaultTo(0); // Individual inventory
    table.integer('inventoryByBox').notNullable().defaultTo(0); // B2B inventory
    table.boolean('isActive').defaultTo(true);
    table.timestamps(true, true); // createdAt, updatedAt
    
    // Indexes for performance
    table.index(['category']);
    table.index(['eggColor']);
    table.index(['isActive']);
    table.index(['name']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('products');
} 