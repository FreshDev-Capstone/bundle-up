import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Drop the existing constraint
  await knex.raw('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check');
  
  // Add the new constraint with correct values
  await knex.raw(`ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'b2c', 'b2b'))`);
}

export async function down(knex: Knex): Promise<void> {
  // Restore the original constraint (if we know what it was)
  await knex.raw('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check');
  
  // Add back the original constraint
  await knex.raw(`ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'b2c', 'b2b'))`);
}

