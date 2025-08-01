import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("carts").del();

  // Get user IDs
  const users = await knex("users").select("id");

  // Inserts seed entries
  const carts = [];

  for (const user of users) {
    carts.push({
      user_id: user.id,
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      status: true,
    });
  }

  await knex("carts").insert(carts);
}
