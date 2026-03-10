import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // ─── Carts ──────────────────────────────────────────────────────────────────
  await knex.schema.createTable('carts', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().nullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('session_id', 255).nullable();
    table.timestamps(true, true);
    // Either user_id or session_id must be set
    table.index(['user_id']);
    table.index(['session_id']);
  });

  // ─── Cart Items ─────────────────────────────────────────────────────────────
  await knex.schema.createTable('cart_items', (table) => {
    table.increments('id').primary();
    table.integer('cart_id').unsigned().notNullable().references('id').inTable('carts').onDelete('CASCADE');
    table.integer('product_id').unsigned().notNullable().references('id').inTable('products').onDelete('CASCADE');
    table.integer('quantity').notNullable().defaultTo(1);
    table.decimal('unit_price', 10, 2).notNullable().comment('Price captured at time of add');
    table.timestamps(true, true);
    table.unique(['cart_id', 'product_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('cart_items');
  await knex.schema.dropTableIfExists('carts');
}
