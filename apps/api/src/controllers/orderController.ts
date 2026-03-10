import type { Response } from 'express';
import db from '../config/db';
import { generateOrderNumber } from '@bundle-up/utils';
import type { AuthenticatedRequest } from '../middleware/auth';

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

  const orderItems = items.map((item: {
    product_id: number;
    quantity: number;
    unit_price: number;
  }) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: Number(item.unit_price).toFixed(2),
    line_total: (Number(item.unit_price) * item.quantity).toFixed(2),
  }));

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

  const query = req.user.role === 'admin'
    ? db('orders').orderBy('created_at', 'desc')
    : db('orders').where({ user_id: req.user.sub }).orderBy('created_at', 'desc');

  const orders = await query;

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

  const orderQuery = db('orders').where('orders.id', Number(id));
  if (req.user.role !== 'admin') {
    orderQuery.andWhere('orders.user_id', req.user.sub);
  }

  const order = await orderQuery.first();
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  const items = await db('order_items')
    .join('products', 'order_items.product_id', 'products.id')
    .select('order_items.*', 'products.name', 'products.slug', 'products.primary_image')
    .where({ 'order_items.order_id': order.id });

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

  const updated = await db('orders').where({ id: Number(id) }).update({ status });
  if (!updated) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  res.json({ success: true, message: 'Order status updated' });
}
