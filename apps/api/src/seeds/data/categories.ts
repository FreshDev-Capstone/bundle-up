import type { Knex } from 'knex';

export const categories = [
  { name: 'Commodity', slug: 'commodity', description: 'Standard commodity eggs', sort_order: 1 },
  { name: 'Organic', slug: 'organic', description: 'Certified organic eggs', sort_order: 2 },
  { name: 'Cage Free', slug: 'cage-free', description: 'Cage-free eggs', sort_order: 3 },
  {
    name: 'Pasture Raised',
    slug: 'pasture-raised',
    description: 'Pasture-raised eggs',
    sort_order: 4,
  },
  { name: 'Heirloom', slug: 'heirloom', description: 'Heritage breed eggs', sort_order: 5 },
  { name: 'Specialty', slug: 'specialty', description: 'Specialty egg varieties', sort_order: 6 },
  { name: 'Milk', slug: 'milk', description: 'Dairy products', sort_order: 7 },
];

export async function seedCategories(knex: Knex): Promise<Record<string, number>> {
  await knex('categories').del();
  const inserted = await knex('categories').insert(categories).returning(['id', 'slug']);
  const categoryMap: Record<string, number> = {};
  for (const row of inserted) {
    categoryMap[row.slug] = row.id;
  }
  return categoryMap;
}
