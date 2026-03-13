import type { Response } from 'express';
import type { Knex } from 'knex';
import db from '../config/db';
import { generateOrderNumber } from '@bundle-up/utils';
import type { AuthenticatedRequest } from '../middleware/auth';

const INVENTORY_DEDUCT_STATUSES = new Set(['confirmed', 'processing', 'shipped', 'delivered']);

async function ensureInventoryRow(trx: Knex.Transaction, productId: number) {
  const existing = await trx('inventory').where({ product_id: productId }).first();
  if (existing) return existing;
  const [created] = await trx('inventory')
    .insert({ product_id: productId, inventory_by_carton: 0, inventory_by_case: 0 })
    .returning('*');
  return created;
}

async function setProductAvailabilityFromInventory(trx: Knex.Transaction, productId: number) {
  const inv = await trx('inventory').where({ product_id: productId }).first();
  const isAvailable =
    Number(inv?.inventory_by_carton ?? 0) > 0 || Number(inv?.inventory_by_case ?? 0) > 0;
  await trx('products')
    .where({ id: productId })
    .update({ is_available: isAvailable, updated_at: trx.fn.now() });
}

async function deductInventoryForOrderIfNeeded(trx: Knex.Transaction, orderId: number) {
  const order = await trx('orders')
    .join('users', 'orders.user_id', 'users.id')
    .select('orders.id', 'orders.status', 'orders.inventory_deducted', 'users.role as user_role')
    .where('orders.id', orderId)
    .first();

  if (!order) return;
  if (order.inventory_deducted) return;
  if (!INVENTORY_DEDUCT_STATUSES.has(order.status)) return;

  const items = await trx('order_items')
    .select('product_id', 'quantity')
    .where({ order_id: orderId });

  for (const item of items as { product_id: number; quantity: number }[]) {
    const inv = await ensureInventoryRow(trx, item.product_id);
    if (order.user_role === 'business') {
      const next = Math.max(0, Number(inv.inventory_by_case ?? 0) - Number(item.quantity));
      await trx('inventory')
        .where({ product_id: item.product_id })
        .update({ inventory_by_case: next, updated_at: trx.fn.now() });
    } else {
      const next = Math.max(0, Number(inv.inventory_by_carton ?? 0) - Number(item.quantity));
      await trx('inventory')
        .where({ product_id: item.product_id })
        .update({ inventory_by_carton: next, updated_at: trx.fn.now() });
    }

    await setProductAvailabilityFromInventory(trx, item.product_id);
  }

  await trx('orders')
    .where({ id: orderId })
    .update({ inventory_deducted: true, updated_at: trx.fn.now() });
}

export async function createOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const { shipping_address_id, billing_address_id, notes } = req.body as {
    shipping_address_id: number;
    billing_address_id?: number;
    notes?: string;
  };

  const cart = await db('carts').where({ user_id: req.user.sub }).first();
  if (!cart) {
    res.status(400).json({ success: false, message: 'Cart is empty' });
    return;
  }

  const items = await db('cart_items')
    .join('products', 'cart_items.product_id', 'products.id')
    .select('cart_items.*', 'products.name', 'products.b2c_unit_price', 'products.b2b_case_price')
    .where({ 'cart_items.cart_id': cart.id });

  if (items.length === 0) {
    res.status(400).json({ success: false, message: 'Cart is empty' });
    return;
  }

  const subtotal = items.reduce(
    (sum: number, item: { unit_price: number; quantity: number }) =>
      sum + Number(item.unit_price) * item.quantity,
    0,
  );
  const tax = Number((subtotal * 0.08).toFixed(2));
  const shipping = 0; // Free shipping for now
  const total = Number((subtotal + tax + shipping).toFixed(2));

  const [order] = await db('orders')
    .insert({
      user_id: req.user.sub,
      order_number: generateOrderNumber(),
      status: 'pending',
      payment_status: 'unpaid',
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      shipping_address_id,
      billing_address_id: billing_address_id ?? shipping_address_id,
      notes: notes ?? null,
    })
    .returning('*');

  const orderItems = items.map(
    (item: { product_id: number; quantity: number; unit_price: number }) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: Number(item.unit_price).toFixed(2),
      line_total: (Number(item.unit_price) * item.quantity).toFixed(2),
    }),
  );

  await db('order_items').insert(orderItems);

  // Clear the cart after successful order
  await db('cart_items').where({ cart_id: cart.id }).del();

  res.status(201).json({ success: true, data: order });
}

export async function listOrders(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const orders =
    req.user.role === 'admin'
      ? await db('orders')
          .join('users', 'orders.user_id', 'users.id')
          .select('orders.*', 'users.email as user_email', 'users.role as user_role')
          .orderBy('orders.created_at', 'desc')
      : await db('orders').where({ user_id: req.user.sub }).orderBy('created_at', 'desc');

  res.json({
    success: true,
    data: {
      data: orders,
      total: orders.length,
      page: 1,
      per_page: orders.length,
      total_pages: 1,
    },
  });
}

export async function getOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const { id } = req.params as { id: string };

  const baseQuery = db('orders').where('orders.id', Number(id));
  const orderQuery =
    req.user.role === 'admin'
      ? baseQuery
          .join('users', 'orders.user_id', 'users.id')
          .select('orders.*', 'users.email as user_email', 'users.role as user_role')
      : baseQuery;

  if (req.user.role !== 'admin') {
    orderQuery.andWhere('orders.user_id', req.user.sub);
  }

  const order = await orderQuery.first();
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  const rawItems = await db('order_items')
    .join('products', 'order_items.product_id', 'products.id')
    .select(
      'order_items.id',
      'order_items.order_id',
      'order_items.product_id',
      'order_items.quantity',
      'order_items.unit_price',
      'order_items.line_total',
      'order_items.created_at',
      'products.name as _product_name',
      'products.slug as _product_slug',
      'products.primary_image as _product_primary_image',
    )
    .where({ 'order_items.order_id': order.id });

  const items = rawItems.map(
    (row: {
      id: number;
      order_id: number;
      product_id: number;
      quantity: number;
      unit_price: string;
      line_total: string;
      created_at: string;
      _product_name: string;
      _product_slug: string;
      _product_primary_image: string | null;
    }) => ({
      id: row.id,
      order_id: row.order_id,
      product_id: row.product_id,
      quantity: row.quantity,
      unit_price: row.unit_price,
      line_total: row.line_total,
      created_at: row.created_at,
      product: {
        id: row.product_id,
        name: row._product_name,
        slug: row._product_slug,
        primary_image: row._product_primary_image ?? null,
      },
    }),
  );

  const shippingAddress = order.shipping_address_id
    ? await db('addresses').where({ id: order.shipping_address_id }).first()
    : null;

  const billingAddress = order.billing_address_id
    ? await db('addresses').where({ id: order.billing_address_id }).first()
    : null;

  res.json({
    success: true,
    data: { ...order, items, shipping_address: shippingAddress, billing_address: billingAddress },
  });
}

export async function updateOrderStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  const { status } = req.body as { status: string };

  const orderId = Number(id);
  const updated = await db.transaction(async (trx) => {
    const didUpdate = await trx('orders')
      .where({ id: orderId })
      .update({ status, updated_at: trx.fn.now() });
    if (!didUpdate) return false;
    await deductInventoryForOrderIfNeeded(trx, orderId);
    return true;
  });

  if (!updated) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  res.json({ success: true, message: 'Order status updated' });
}

export async function updateOrderAdmin(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  const { status, tracking_number } = req.body as {
    status?: string;
    tracking_number?: string | null;
  };

  const allowedStatuses = new Set([
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ]);

  const patch: Record<string, unknown> = {};
  if (typeof status === 'string') {
    if (!allowedStatuses.has(status)) {
      res.status(400).json({ success: false, message: 'Invalid order status' });
      return;
    }
    patch['status'] = status;
  }

  if (tracking_number === null || typeof tracking_number === 'string') {
    patch['tracking_number'] = tracking_number;
  }

  if (Object.keys(patch).length === 0) {
    res.status(400).json({ success: false, message: 'No valid fields provided' });
    return;
  }

  const orderId = Number(id);
  const updated = await db.transaction(async (trx) => {
    const didUpdate = await trx('orders')
      .where({ id: orderId })
      .update({ ...patch, updated_at: trx.fn.now() });
    if (!didUpdate) return false;
    await deductInventoryForOrderIfNeeded(trx, orderId);
    return true;
  });

  if (!updated) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  const order = await db('orders')
    .join('users', 'orders.user_id', 'users.id')
    .select('orders.*', 'users.email as user_email', 'users.role as user_role')
    .where('orders.id', orderId)
    .first();

  res.json({ success: true, data: order });
}
