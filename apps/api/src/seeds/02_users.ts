import type { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // Clear in dependency order
  await knex('business_accounts').del();
  await knex('user_profiles').del();
  await knex('users').del();

  const passwordHash = await bcrypt.hash('password123', 10);

  // ─── Admin user ───────────────────────────────────────────────────────────
  const [admin] = await knex('users')
    .insert({
      email: 'admin@bundleup.com',
      password_hash: passwordHash,
      role: 'admin',
      is_active: true,
    })
    .returning('id');

  await knex('user_profiles').insert({
    user_id: admin.id,
    first_name: 'Admin',
    last_name: 'User',
  });

  // ─── B2C customer ─────────────────────────────────────────────────────────
  const [customer] = await knex('users')
    .insert({
      email: 'customer@example.com',
      password_hash: passwordHash,
      role: 'customer',
      is_active: true,
    })
    .returning('id');

  await knex('user_profiles').insert({
    user_id: customer.id,
    first_name: 'Jane',
    last_name: 'Consumer',
    phone: '555-100-0001',
  });

  // ─── B2B business customer ────────────────────────────────────────────────
  const [business] = await knex('users')
    .insert({
      email: 'buyer@freshmarket.com',
      password_hash: passwordHash,
      role: 'business',
      is_active: true,
    })
    .returning('id');

  await knex('user_profiles').insert({
    user_id: business.id,
    first_name: 'Bob',
    last_name: 'Buyer',
    phone: '555-200-0001',
  });

  await knex('business_accounts').insert({
    user_id: business.id,
    company_name: 'Fresh Market Inc.',
    tax_id: '12-3456789',
    billing_email: 'billing@freshmarket.com',
    is_approved: true,
  });

  console.info('✅ Seeded 3 users (admin, customer, business)');
}
