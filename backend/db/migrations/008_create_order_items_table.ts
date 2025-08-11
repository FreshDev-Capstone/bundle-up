import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("order_items", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("order_id")
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table
      .uuid("product_id")
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    table.integer("quantity").notNullable();
    table.decimal("price", 10, 2).notNullable();

    // Indexes
    table.index("order_id");
    table.index("product_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("order_items");
}
