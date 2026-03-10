import type { Knex } from 'knex';
import { productCatalog } from './data/productCatalog';
import { resolveProductImage } from './data/imageMap';
import { seedCategories } from './data/categories';

export async function seed(knex: Knex): Promise<void> {
  // ─── Categories ───────────────────────────────────────────────────────────
  const categoryMap = await seedCategories(knex);

  // ─── Products ─────────────────────────────────────────────────────────────
  await knex('inventory').del();
  await knex('products').del();

  const productRows = productCatalog.map((p) => {
    const categoryId = categoryMap[p.category_slug];
    if (!categoryId) {
      throw new Error(`Unknown category slug: ${p.category_slug}`);
    }

    // Generate a deterministic SKU from the legacy product ID
    const sku = `EGG-${String(p.legacy_product_id).padStart(4, '0')}`;

    return {
      sku,
      legacy_product_id: p.legacy_product_id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      category_id: categoryId,
      product_color: p.product_color,
      product_count: p.product_count,
      product_size: p.product_size,
      farming_method: p.farming_method,
      packaging_unit: 'carton',
      case_pack: 12,
      b2c_unit_price: p.b2c_unit_price,
      b2b_case_price: p.b2b_case_price,
      primary_image: resolveProductImage(p.legacy_product_id),
      is_available: p.is_available,
      is_active: p.is_active,
    };
  });

  const insertedProducts = await knex('products').insert(productRows).returning(['id', 'legacy_product_id']);

  // ─── Inventory ────────────────────────────────────────────────────────────
  const inventoryRows = insertedProducts.map((row) => {
    const catalog = productCatalog.find((p) => p.legacy_product_id === row.legacy_product_id);
    if (!catalog) {
      throw new Error(`Missing catalog data for legacy_product_id: ${row.legacy_product_id}`);
    }
    return {
      product_id: row.id,
      inventory_by_carton: catalog.inventory_by_carton,
      inventory_by_case: catalog.inventory_by_case,
    };
  });

  await knex('inventory').insert(inventoryRows);

  console.info(`✅ Seeded ${productRows.length} products and ${inventoryRows.length} inventory records`);
}
