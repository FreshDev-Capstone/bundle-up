import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("products", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.integer("product_id").unique().notNullable();
    table.string("name").notNullable();
    table.text("description");
    table.string("category").notNullable();
    table.string("product_color");
    table.integer("product_count").notNullable();
    table.json("images").nullable().defaultTo(null);
    table.decimal("b2c_price", 10, 2).notNullable();
    table.decimal("b2b_price", 10, 2).notNullable();
    table.integer("inventory_by_carton").defaultTo(0);
    table.integer("inventory_by_box").defaultTo(0);
    table.boolean("is_available").defaultTo(true);
    table.boolean("is_active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Indexes
    table.index("category");
    table.index("product_color");
    table.index("product_count");
    table.index("is_available");
    table.index("is_active");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("products");
}
