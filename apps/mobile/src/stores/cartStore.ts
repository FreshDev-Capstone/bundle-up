import { create } from 'zustand';
import type { CartWithItems } from '@bundle-up/shared-types';
import { apiClient } from '../lib/apiClient';

interface CartState {
  cart: CartWithItems | null;
  isLoading: boolean;

  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    const res = await apiClient.getCart();
    if (res.success) set({ cart: res.data, isLoading: false });
  },

  addItem: async (productId, quantity) => {
    const res = await apiClient.addToCart(productId, quantity);
    if (res.success) set({ cart: res.data });
  },

  updateItem: async (itemId, quantity) => {
    const res = await apiClient.updateCartItem(itemId, quantity);
    if (res.success) set({ cart: res.data });
  },

  removeItem: async (itemId) => {
    const res = await apiClient.removeCartItem(itemId);
    if (res.success) set({ cart: res.data });
  },
}));

export function useCartItemCount(cart: CartWithItems | null): number {
  return cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;
}
