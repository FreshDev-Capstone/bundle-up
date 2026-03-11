/**
 * Image map for products.
 *
 * Lookup priority:
 *   1. SKU (generated from legacy_product_id)
 *   2. Slug
 *   3. Normalized product name (lowercase, no punctuation)
 *
 * All paths are local static asset paths under /assets.
 * To swap for cloud storage later, update the values here only – the
 * seeder and product queries reference this map exclusively.
 */

/** Map keyed by legacy_product_id (number) for fast SKU-first lookup */
export const imageMapByLegacyId: Record<number, string> = {
  101: '/assets/eggs/Commodity White Eggs/101-commodity.png',
  102: '/assets/eggs/Commodity White Eggs/102-commodity.png',
  103: '/assets/eggs/Commodity White Eggs/103-commodity.png',
  104: '/assets/eggs/Commodity White Eggs/104-commodity.png',
  105: '/assets/eggs/Commodity White Eggs/105-commodity.png',
  106: '/assets/eggs/Commodity White Eggs/106-commodity.png',
  109: '/assets/eggs/Commodity White Eggs/109-commodity.png',
  110: '/assets/eggs/Commodity White Eggs/110-commodity.png',
  111: '/assets/eggs/Commodity Brown Eggs/111-commodity.png',
  112: '/assets/eggs/Commodity Brown Eggs/112-commodity.png',
  113: '/assets/eggs/Commodity Brown Eggs/113-commodity.png',
  114: '/assets/eggs/Commodity Brown Eggs/114-commodity.png',
  115: '/assets/eggs/Commodity Brown Eggs/115-commodity.png',
  121: '/assets/eggs/Organic Brown Eggs/121-organic.png',
  122: '/assets/eggs/Organic Brown Eggs/122-organic.png',
  123: '/assets/eggs/Organic Brown Eggs/123-organic.png',
  125: '/assets/eggs/Organic Brown Eggs/125-organic.png',
  126: '/assets/eggs/Organic Brown Eggs/126-organic.png',
  127: '/assets/eggs/Organic Brown Eggs/127-organic.png',
  131: '/assets/eggs/Cage Free Brown Eggs/131-cage-free.png',
  132: '/assets/eggs/Cage Free Brown Eggs/132-cage-free.png',
  133: '/assets/eggs/Cage Free Brown Eggs/133-cage-free.png',
  134: '/assets/eggs/Cage Free Brown Eggs/134-cage-free.png',
  135: '/assets/eggs/Cage Free Brown Eggs/135-cage-free.png',
  136: '/assets/eggs/Cage Free White Eggs/136-cage-free.png',
  137: '/assets/eggs/Cage Free White Eggs/137-cage-free.png',
  142: '/assets/eggs/Quail White Eggs/142-copy.png',
  143: '/assets/eggs/Duck White Eggs/143-duck.png',
  145: '/assets/eggs/Hard Boiled Eggs/145-hard-boiled.png',
  146: '/assets/eggs/Pasture Raised Brown Eggs/146-pasture.png',
  147: '/assets/eggs/Pasture Raised Brown Eggs/147-pasture.png',
  // Note: original seed had HTML entity &amp; in path; normalized below
  148: '/assets/eggs/Heirloom Blue & Brown Eggs/148-heirloom-blue.png',
  149: '/assets/eggs/Heirloom Blue & Brown Eggs/149-heirloom-brown.png',

  // Milk (preview category)
  201: '/assets/milk/Organic Milk/4-211x428.jpg',
};

/**
 * Resolve the image path for a product.
 * Falls back to null if no mapping found.
 */
export function resolveProductImage(legacyId: number): string | null {
  return imageMapByLegacyId[legacyId] ?? null;
}
