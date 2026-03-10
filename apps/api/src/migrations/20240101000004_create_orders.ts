import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // ─── Orders ─────────────────────────────────────────────────────────────────
  await knex.schema.createTable('orders', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('RESTRICT');
    table.string('order_number', 50).notNullable().unique();
    table.enu('status', [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
    ]).notNullable().defaultTo('pending');
    table.enu('payment_status', ['unpaid', 'paid', 'refunded', 'failed'])
      .notNullable()
      .defaultTo('unpaid');
    table.decimal('subtotal', 10, 2).notNullable();
    table.decimal('tax', 10, 2).notNullable().defaultTo(0);
    table.decimal('shipping', 10, 2).notNullable().defaultTo(0);
    table.decimal('total', 10, 2).notNullable();
    table.integer('shipping_address_id').unsigned().nullable().references('id').inTable('addresses').onDelete('SET NULL');
    table.integer('billing_address_id').unsigned().nullable().references('id').inTable('addresses').onDelete('SET NULL');
    table.text('notes').nullable();
    table.timestamps(true, true);
    table.index(['user_id']);
    table.index(['order_number']);
    table.index(['status']);
  });

  // ─── Order Items ────────────────────────────────────────────────────────────
  await knex.schema.createTable('order_items', (table) => {
    table.increments('id').primary();
    table.integer('order_id').unsigned().notNullable().references('id').inTable('orders').onDelete('CASCADE');
    table.integer('product_id').unsigned().notNullable().references('id').inTable('products').onDelete('RESTRICT');
    table.integer('quantity').notNullable();
    table.decimal('unit_price', 10, 2).notNullable().comment('Price at time of purchase');
    table.decimal('line_total', 10, 2).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('order_items');
  await knex.schema.dropTableIfExists('orders');
}
