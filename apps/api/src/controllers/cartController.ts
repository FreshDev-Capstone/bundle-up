import type { Response } from 'express';
import db from '../config/db';
import type { AuthenticatedRequest } from '../middleware/auth';

async function getOrCreateCart(userId: number) {
  let cart = await db('carts').where({ user_id: userId }).first();
  if (!cart) {
    const [newCart] = await db('carts').insert({ user_id: userId }).returning('*');
    cart = newCart;
  }
  return cart;
}

async function getCartWithItems(cartId: number) {
  const cart = await db('carts').where({ id: cartId }).first();
  const items = await db('cart_items')
    .join('products', 'cart_items.product_id', 'products.id')
    .select(
      'cart_items.*',
      'products.name',
      'products.slug',
      'products.primary_image',
      'products.b2c_unit_price',
      'products.b2b_case_price',
    )
    .where({ 'cart_items.cart_id': cartId });

  return { ...cart, items };
}

export async function getCart(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }
  const cart = await getOrCreateCart(req.user.sub);
  const cartWithItems = await getCartWithItems(cart.id);
  res.json({ success: true, data: cartWithItems });
}

export async function addToCart(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const { product_id, quantity } = req.body as { product_id: number; quantity: number };

  const product = await db('products').where({ id: product_id, is_active: true }).first();
  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  // Use role-appropriate price
  const unitPrice =
    req.user.role === 'business' ? product.b2b_case_price : product.b2c_unit_price;

  const cart = await getOrCreateCart(req.user.sub);

  const existing = await db('cart_items')
    .where({ cart_id: cart.id, product_id })
    .first();

  if (existing) {
    await db('cart_items')
      .where({ id: existing.id })
      .update({ quantity: existing.quantity + quantity, unit_price: unitPrice });
  } else {
    await db('cart_items').insert({
      cart_id: cart.id,
      product_id,
      quantity,
      unit_price: unitPrice,
    });
  }

  const cartWithItems = await getCartWithItems(cart.id);
  res.json({ success: true, data: cartWithItems });
}

export async function updateCartItem(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const { itemId } = req.params as { itemId: string };
  const { quantity } = req.body as { quantity: number };

  const cart = await db('carts').where({ user_id: req.user.sub }).first();
  if (!cart) {
    res.status(404).json({ success: false, message: 'Cart not found' });
    return;
  }

  if (quantity === 0) {
    await db('cart_items').where({ id: Number(itemId), cart_id: cart.id }).del();
  } else {
    await db('cart_items')
      .where({ id: Number(itemId), cart_id: cart.id })
      .update({ quantity });
  }

  const cartWithItems = await getCartWithItems(cart.id);
  res.json({ success: true, data: cartWithItems });
}

export async function removeCartItem(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const { itemId } = req.params as { itemId: string };
  const cart = await db('carts').where({ user_id: req.user.sub }).first();
  if (!cart) {
    res.status(404).json({ success: false, message: 'Cart not found' });
    return;
  }

  await db('cart_items').where({ id: Number(itemId), cart_id: cart.id }).del();
  const cartWithItems = await getCartWithItems(cart.id);
  res.json({ success: true, data: cartWithItems });
}

export async function clearCart(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const cart = await db('carts').where({ user_id: req.user.sub }).first();
  if (cart) {
    await db('cart_items').where({ cart_id: cart.id }).del();
  }
  res.json({ success: true, message: 'Cart cleared' });
}
