import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('orders', (table) => {
    table.boolean('inventory_deducted').notNullable().defaultTo(false);
    table.index(['inventory_deducted']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('orders', (table) => {
    table.dropIndex(['inventory_deducted']);
    table.dropColumn('inventory_deducted');
  });
}
