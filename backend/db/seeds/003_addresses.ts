import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("addresses").del();

  // Get user IDs
  const users = await knex("users").select("id", "email");

  // Inserts seed entries
  const addresses = [];

  for (const user of users) {
    if (user.email.includes("restaurant") || user.email.includes("cafe")) {
      // B2B addresses
      addresses.push({
        user_id: user.id,
        street: "123 Business Ave",
        city: "New York",
        state: "NY",
        zip_code: "10001",
        is_default: true,
      });
    } else {
      // B2C addresses
      addresses.push({
        user_id: user.id,
        street: "456 Home Street",
        city: "Los Angeles",
        state: "CA",
        zip_code: "90210",
        is_default: true,
      });

      // Add a second address for some users
      if (user.email === "john.doe@example.com") {
        addresses.push({
          user_id: user.id,
          street: "789 Work Blvd",
          city: "San Francisco",
          state: "CA",
          zip_code: "94102",
          is_default: false,
        });
      }
    }
  }

  await knex("addresses").insert(addresses);
}
