import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // ─── Categories ─────────────────────────────────────────────────────────────
  await knex.schema.createTable('categories', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable().unique();
    table.string('slug', 100).notNullable().unique();
    table.text('description').nullable();
    table.integer('sort_order').notNullable().defaultTo(0);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });

  // ─── Products ───────────────────────────────────────────────────────────────
  await knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('sku', 50).notNullable().unique();
    table.integer('legacy_product_id').nullable().unique();
    table.string('name', 255).notNullable();
    table.string('slug', 255).notNullable().unique();
    table.text('description').nullable();
    table.integer('category_id').unsigned().nullable().references('id').inTable('categories').onDelete('SET NULL');
    table.string('product_type', 100).nullable();
    table.string('product_color', 50).nullable();
    table.integer('product_count').nullable();
    table.string('product_size', 50).nullable();
    table.string('farming_method', 100).nullable();
    table.enu('packaging_unit', ['carton', 'case']).notNullable().defaultTo('carton');
    table.integer('case_pack').notNullable().defaultTo(12).comment('Number of cartons per case');
    /** Retail price per carton – B2C */
    table.decimal('b2c_unit_price', 10, 2).notNullable();
    /** Wholesale price per case – B2B */
    table.decimal('b2b_case_price', 10, 2).notNullable();
    table.string('primary_image', 500).nullable();
    table.boolean('is_available').notNullable().defaultTo(true);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });

  // ─── Inventory ──────────────────────────────────────────────────────────────
  await knex.schema.createTable('inventory', (table) => {
    table.increments('id').primary();
    table.integer('product_id').unsigned().notNullable().unique().references('id').inTable('products').onDelete('CASCADE');
    table.integer('inventory_by_carton').notNullable().defaultTo(0);
    table.integer('inventory_by_case').notNullable().defaultTo(0);
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('inventory');
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('categories');
}
