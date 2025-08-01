import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("orders", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
    table
      .uuid("cart_id")
      .references("id")
      .inTable("carts")
      .onDelete("SET NULL");
    table
      .uuid("address_id")
      .references("id")
      .inTable("addresses")
      .onDelete("SET NULL");
    table.string("order_number").unique().notNullable();
    table
      .enum("status", ["pending", "shipped", "delivered", "cancelled"])
      .defaultTo("pending");
    table.jsonb("items").defaultTo("[]");
    table.decimal("subtotal", 10, 2).defaultTo(0);
    table.decimal("tax", 10, 2).defaultTo(0);
    table.decimal("shipping", 10, 2).defaultTo(0);
    table.decimal("total", 10, 2).defaultTo(0);
    table.text("notes");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Indexes
    table.index("user_id");
    table.index("order_number");
    table.index("status");
    table.index("created_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("orders");
}
