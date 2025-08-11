import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("addresses", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.string("street").notNullable();
    table.string("city").notNullable();
    table.string("state").notNullable();
    table.string("zip_code").notNullable();
    table.boolean("is_default").defaultTo(false);

    // Indexes
    table.index("user_id");
    table.index("is_default");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("addresses");
}
