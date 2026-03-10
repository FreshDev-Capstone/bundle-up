import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // ─── Users ──────────────────────────────────────────────────────────────────
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.enu('role', ['customer', 'business', 'admin']).notNullable().defaultTo('customer');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });

  // ─── User Profiles ──────────────────────────────────────────────────────────
  await knex.schema.createTable('user_profiles', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('phone', 50).nullable();
    table.timestamps(true, true);
  });

  // ─── Business Accounts ──────────────────────────────────────────────────────
  await knex.schema.createTable('business_accounts', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().unique().references('id').inTable('users').onDelete('CASCADE');
    table.string('company_name', 255).notNullable();
    table.string('tax_id', 50).nullable();
    table.string('billing_email', 255).nullable();
    table.boolean('is_approved').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });

  // ─── Addresses ──────────────────────────────────────────────────────────────
  await knex.schema.createTable('addresses', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('label', 100).nullable();
    table.string('street_line1', 255).notNullable();
    table.string('street_line2', 255).nullable();
    table.string('city', 100).notNullable();
    table.string('state', 100).notNullable();
    table.string('zip', 20).notNullable();
    table.string('country', 100).notNullable().defaultTo('US');
    table.boolean('is_default').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('addresses');
  await knex.schema.dropTableIfExists('business_accounts');
  await knex.schema.dropTableIfExists('user_profiles');
  await knex.schema.dropTableIfExists('users');
}
