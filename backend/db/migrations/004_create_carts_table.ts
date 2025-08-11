import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("carts", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.jsonb("items").defaultTo("[]");
    table.decimal("subtotal", 10, 2).defaultTo(0);
    table.decimal("tax", 10, 2).defaultTo(0);
    table.decimal("total", 10, 2).defaultTo(0);
    table.boolean("status").defaultTo(true);
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Indexes
    table.index("user_id");
    table.index("status");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("carts");
}
