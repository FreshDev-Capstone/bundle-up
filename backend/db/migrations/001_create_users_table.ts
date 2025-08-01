import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("company_name");
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("email").unique().notNullable();
    table.text("password_hash");
    table.enum("role", ["b2c", "b2b", "admin"]).defaultTo("b2c");
    table.string("googleId").unique();
    table.boolean("is_email_verified").defaultTo(false);
    table.timestamp("email_verified_at");
    table.timestamp("last_login_at");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Indexes
    table.index("email");
    table.index("role");
    table.index("googleId");
    table.index("created_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
