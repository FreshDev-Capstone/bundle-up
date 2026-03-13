import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('orders', (table) => {
    table.string('tracking_number', 100).nullable();
    table.index(['tracking_number']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('orders', (table) => {
    table.dropIndex(['tracking_number']);
    table.dropColumn('tracking_number');
  });
}
