import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("products", (table) => {
    table.integer("id").primary();

    table.string("name").notNullable();
    table.text("description").notNullable();
    table.string("category").notNullable();
    table.string("eggColor");
    table.integer("eggCount").notNullable();
    table.string("imageUrl").notNullable();

    table.decimal("b2cPrice", 10, 2).notNullable();
    table.decimal("b2bPrice", 10, 2).notNullable();

    table.integer("inventoryByCarton").defaultTo(0);
    table.integer("inventoryByBox").defaultTo(0);

    table.boolean("isAvailable").defaultTo(true);
    table.boolean("isActive").defaultTo(true);

    table.timestamps(true, true); // createdAt, updatedAt

    table.index("category");
    table.index("eggColor");
    table.index("eggCount");
    table.index("isAvailable");
    table.index("isActive");
    table.index("name");
    table.index("createdAt");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("products");
}
