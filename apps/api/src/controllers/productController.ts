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
  } = req.query as Record<string, string>;

  const pageNum = Number(page);
  const perPageNum = Math.min(Number(per_page), 100);
  const offset = (pageNum - 1) * perPageNum;

  let query = db('products')
    .join('categories', 'products.category_id', 'categories.id')
    .select(
      'products.*',
      'categories.name as category_name',
      'categories.slug as category_slug',
    )
    .where('products.is_active', true);

  if (category) query = query.where('categories.slug', category);
  if (color) query = query.where('products.product_color', color);
  if (size) query = query.where('products.product_size', size);
  if (farming_method) query = query.where('products.farming_method', farming_method);
  if (search) {
    query = query.whereILike('products.name', `%${search}%`);
  }

  const countResult = await query.clone().count('products.id as count').first();
  const total = Number((countResult as { count: string | number } | undefined)?.count ?? 0);

  const products = await query.orderBy('products.id').limit(perPageNum).offset(offset);

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

  const updated = await db('products').where({ id: Number(id) }).update({ is_available });

  if (!updated) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  res.json({ success: true, message: 'Product availability updated' });
}
