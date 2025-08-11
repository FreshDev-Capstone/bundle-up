import { Knex } from "knex";
import bcrypt from "bcryptjs";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Hash passwords
  const passwordHash = await bcrypt.hash("password123", 12);

  // Inserts seed entries
  await knex("users").insert([
    {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      password_hash: passwordHash,
      role: "b2c",
      is_email_verified: true,
      email_verified_at: new Date(),
    },
    {
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@example.com",
      password_hash: passwordHash,
      role: "b2c",
      is_email_verified: true,
      email_verified_at: new Date(),
    },
    {
      first_name: "Bob",
      last_name: "Johnson",
      email: "bob.johnson@restaurant.com",
      company_name: "Johnson's Restaurant",
      password_hash: passwordHash,
      role: "b2b",
      is_email_verified: true,
      email_verified_at: new Date(),
    },
    {
      first_name: "Alice",
      last_name: "Williams",
      email: "alice.williams@cafe.com",
      company_name: "Williams Cafe",
      password_hash: passwordHash,
      role: "b2b",
      is_email_verified: true,
      email_verified_at: new Date(),
    },
    {
      first_name: "Admin",
      last_name: "User",
      email: "admin@naturalfoodsinc.com",
      password_hash: passwordHash,
      role: "admin",
      is_email_verified: true,
      email_verified_at: new Date(),
    },
  ]);
}
