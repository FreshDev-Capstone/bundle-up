import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("payments", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("order_id")
      .unique()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table
      .enum("payment_status", ["paid", "failed", "pending"])
      .defaultTo("pending");
    table.string("payment_provider").defaultTo("stripe");
    table.string("provider_charge_id");
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Indexes
    table.index("payment_status");
    table.index("payment_provider");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("payments");
}
