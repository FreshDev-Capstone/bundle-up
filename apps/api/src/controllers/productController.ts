import type { Request, Response } from 'express';
import db from '../config/db';
import { getPaginationMeta } from '@bundle-up/utils';
import type { AuthenticatedRequest } from '../middleware/auth';

export async function listProducts(req: Request, res: Response): Promise<void> {
  const {
    page = 1,
    per_page = 24,
    category,
    color,
    size,
    farming_method,
    search,
    is_available,
  } = req.query as Record<string, string>;

  const pageNum = Number(page);
  const perPageNum = Math.min(Number(per_page), 100);
  const offset = (pageNum - 1) * perPageNum;

  const applyFilters = (query: ReturnType<typeof db>) => {
    let filtered = query.where('products.is_active', true);

    if (category) {
      filtered = filtered.where((builder) => {
        builder.where('categories.slug', category);

        if (category === 'organic') {
          builder.orWhereILike('products.name', '%Organic%');
        }

        if (category === 'cage-free') {
          builder.orWhere('products.farming_method', 'Cage Free');
        }

        if (category === 'pasture-raised') {
          builder.orWhere('products.farming_method', 'Pasture Raised');
        }
      });
    }
    if (color) filtered = filtered.where('products.product_color', color);
    if (size) filtered = filtered.where('products.product_size', size);
    if (farming_method) filtered = filtered.where('products.farming_method', farming_method);
    if (is_available === 'true') filtered = filtered.where('products.is_available', true);
    if (is_available === 'false') filtered = filtered.where('products.is_available', false);
    if (search) {
      filtered = filtered.whereILike('products.name', `%${search}%`);
    }

    return filtered;
  };

  const productsQuery = applyFilters(
    db('products')
      .join('categories', 'products.category_id', 'categories.id')
      .select('products.*', 'categories.name as category_name', 'categories.slug as category_slug'),
  );

  const countQuery = applyFilters(
    db('products').join('categories', 'products.category_id', 'categories.id'),
  );

  const countResult = await countQuery.countDistinct('products.id as count').first();
  const total = Number((countResult as { count: string | number } | undefined)?.count ?? 0);

  const products = await productsQuery.orderBy('products.id').limit(perPageNum).offset(offset);

  res.json({
    success: true,
    data: {
      data: products,
      ...getPaginationMeta(total, pageNum, perPageNum),
    },
  });
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  const { idOrSlug } = req.params as { idOrSlug: string };

  const isId = /^\d+$/.test(idOrSlug);
  const query = db('products')
    .join('categories', 'products.category_id', 'categories.id')
    .select('products.*', 'categories.name as category_name', 'categories.slug as category_slug')
    .where('products.is_active', true);

  const product = isId
    ? await query.where('products.id', Number(idOrSlug)).first()
    : await query.where('products.slug', idOrSlug).first();

  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  const inventory = await db('inventory').where({ product_id: product.id }).first();

  res.json({ success: true, data: { ...product, inventory } });
}

export async function listProductsAdmin(req: Request, res: Response): Promise<void> {
  const products = await db('products')
    .join('categories', 'products.category_id', 'categories.id')
    .leftJoin('inventory', 'products.id', 'inventory.product_id')
    .select(
      'products.*',
      'categories.name as category_name',
      'inventory.inventory_by_carton',
      'inventory.inventory_by_case',
    )
    .orderBy('products.id');

  res.json({ success: true, data: products });
}

export async function updateProductAvailability(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  const { id } = req.params as { id: string };
  const { is_available } = req.body as { is_available: boolean };

  const updated = await db('products')
    .where({ id: Number(id) })
    .update({ is_available });

  if (!updated) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  res.json({ success: true, message: 'Product availability updated' });
}

export async function updateProductAdmin(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  const updates = req.body as Partial<{
    name: string;
    description: string | null;
    category_id: number | null;
    product_type: string | null;
    product_color: string | null;
    product_count: number | null;
    product_size: string | null;
    farming_method: string | null;
    packaging_unit: 'carton' | 'case';
    case_pack: number;
    b2c_unit_price: number;
    b2b_case_price: number;
    primary_image: string | null;
    is_available: boolean;
    is_active: boolean;
  }>;

  const allowedKeys: (keyof typeof updates)[] = [
    'name',
    'description',
    'category_id',
    'product_type',
    'product_color',
    'product_count',
    'product_size',
    'farming_method',
    'packaging_unit',
    'case_pack',
    'b2c_unit_price',
    'b2b_case_price',
    'primary_image',
    'is_available',
    'is_active',
  ];

  const patch: Record<string, unknown> = {};
  for (const key of allowedKeys) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      patch[key] = updates[key];
    }
  }

  if (Object.keys(patch).length === 0) {
    res.status(400).json({ success: false, message: 'No valid fields provided' });
    return;
  }

  const updated = await db('products')
    .where({ id: Number(id) })
    .update({ ...patch, updated_at: db.fn.now() });

  if (!updated) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  const product = await db('products')
    .join('categories', 'products.category_id', 'categories.id')
    .select('products.*', 'categories.name as category_name', 'categories.slug as category_slug')
    .where('products.id', Number(id))
    .first();

  res.json({ success: true, data: product });
}

export async function updateProductInventoryAdmin(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  const { id } = req.params as { id: string };
  const { inventory_by_carton, inventory_by_case } = req.body as {
    inventory_by_carton?: number;
    inventory_by_case?: number;
  };

  const productId = Number(id);
  const patch: Record<string, unknown> = {};
  if (inventory_by_carton !== undefined)
    patch['inventory_by_carton'] = Math.max(0, Number(inventory_by_carton));
  if (inventory_by_case !== undefined)
    patch['inventory_by_case'] = Math.max(0, Number(inventory_by_case));

  if (Object.keys(patch).length === 0) {
    res.status(400).json({ success: false, message: 'No valid fields provided' });
    return;
  }

  await db.transaction(async (trx) => {
    const existing = await trx('inventory').where({ product_id: productId }).first();
    if (existing) {
      await trx('inventory')
        .where({ product_id: productId })
        .update({ ...patch, updated_at: trx.fn.now() });
    } else {
      await trx('inventory').insert({
        product_id: productId,
        inventory_by_carton: 0,
        inventory_by_case: 0,
        ...patch,
      });
    }

    const inv = await trx('inventory').where({ product_id: productId }).first();
    const isAvailable =
      Number(inv?.inventory_by_carton ?? 0) > 0 || Number(inv?.inventory_by_case ?? 0) > 0;
    await trx('products')
      .where({ id: productId })
      .update({ is_available: isAvailable, updated_at: trx.fn.now() });
  });

  const product = await db('products')
    .join('categories', 'products.category_id', 'categories.id')
    .leftJoin('inventory', 'products.id', 'inventory.product_id')
    .select(
      'products.*',
      'categories.name as category_name',
      'categories.slug as category_slug',
      'inventory.inventory_by_carton',
      'inventory.inventory_by_case',
    )
    .where('products.id', productId)
    .first();

  res.json({ success: true, data: product });
}
