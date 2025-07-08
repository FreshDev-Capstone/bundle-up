import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

    table.string("email").unique().notNullable();
    table.string("firstName").notNullable();
    table.string("lastName").notNullable();

    table.enum("role", ["admin", "b2c", "b2b"]).defaultTo("b2c");

    table.string("googleId").unique();
    table.string("passwordHash");

    table.boolean("isEmailVerified").defaultTo(false);
    table.timestamp("emailVerifiedAt");

    table.timestamp("lastLoginAt");

    table.timestamps(true, true); // createdAt, updatedAt

    table.index("email");
    table.index("role");
    table.index("googleId");
    table.index("createdAt");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
