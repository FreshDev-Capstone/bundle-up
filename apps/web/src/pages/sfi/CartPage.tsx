import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@bundle-up/utils';
import { Button } from '@bundle-up/ui';
import { useCartStore, useCartItemCount } from '../../stores/cartStore';

interface CartPageProps {
  variant?: 'sfi' | 'nfi';
}

export function CartPage({ variant = 'sfi' }: CartPageProps) {
  const { cart, updateItem, removeItem, clearCart } = useCartStore();
  const itemCount = useCartItemCount(cart);

  const productsRoute = variant === 'nfi' ? '/nfi/products' : '/products';
  const checkoutRoute = variant === 'nfi' ? '/nfi/checkout' : '/checkout';

  if (!cart || itemCount === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <span className="text-6xl mb-4">🛒</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some eggs to get started!</p>
        <Link
          to={productsRoute}
          className="rounded-md bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.unit_price) * item.quantity,
    0,
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="space-y-4 mb-8">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="h-16 w-16 flex-shrink-0 rounded bg-gray-50 overflow-hidden">
              {(item as typeof item & { primary_image?: string }).primary_image ? (
                <img
                  src={(item as typeof item & { primary_image?: string }).primary_image}
                  alt={(item as typeof item & { name?: string }).name}
                  className="h-full w-full object-contain p-1"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl">🥚</div>
              )}
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {(item as typeof item & { name?: string }).name}
              </p>
              <p className="text-sm text-gray-500">{formatPrice(item.unit_price)} each</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateItem(item.id, item.quantity - 1)}
                className="h-7 w-7 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center"
              >
                –
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => updateItem(item.id, item.quantity + 1)}
                className="h-7 w-7 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center"
              >
                +
              </button>
            </div>

            <p className="w-20 text-right text-sm font-semibold">
              {formatPrice(Number(item.unit_price) * item.quantity)}
            </p>

            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-400 hover:text-red-500 text-sm ml-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>Subtotal ({itemCount} items)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between mb-4 text-sm text-gray-600">
          <span>Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-4">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            to={checkoutRoute}
            className="block rounded-md bg-green-600 px-6 py-3 text-center text-sm font-medium text-white hover:bg-green-700"
          >
            Proceed to Checkout
          </Link>
          <button onClick={() => clearCart()} className="text-sm text-gray-400 hover:text-red-500">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
