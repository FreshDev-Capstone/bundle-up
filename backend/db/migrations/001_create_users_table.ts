import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.enum('role', ['admin', 'individual', 'b2b']).defaultTo('individual');
    table.string('googleId').unique();
    table.string('passwordHash'); // For non-Google users
    table.boolean('isEmailVerified').defaultTo(false);
    table.timestamp('emailVerifiedAt');
    table.timestamp('lastLoginAt');
    table.timestamps(true, true); // createdAt, updatedAt
    
    // Indexes for performance
    table.index(['email']);
    table.index(['role']);
    table.index(['googleId']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
} 