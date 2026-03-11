import { create } from 'zustand';
import type { CartWithItems } from '@bundle-up/shared-types';
import { apiClient } from '../lib/apiClient';

interface CartState {
  cart: CartWithItems | null;
  isLoading: boolean;
  error: string | null;

  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  resetCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true });
    const res = await apiClient.getCart();
    if (res.success) {
      set({ cart: res.data, isLoading: false });
    } else {
      set({ cart: null, error: res.message, isLoading: false });
    }
  },

  addItem: async (productId, quantity) => {
    set({ isLoading: true });
    const res = await apiClient.addToCart(productId, quantity);
    if (res.success) {
      set({ cart: res.data, isLoading: false });
    } else {
      set({ error: res.message, isLoading: false });
    }
  },

  updateItem: async (itemId, quantity) => {
    const res = await apiClient.updateCartItem(itemId, quantity);
    if (res.success) {
      set({ cart: res.data });
    }
  },

  removeItem: async (itemId) => {
    const res = await apiClient.removeCartItem(itemId);
    if (res.success) {
      set({ cart: res.data });
    }
  },

  clearCart: async () => {
    await apiClient.clearCart();
    set({ cart: null });
  },

  resetCart: () => {
    set({ cart: null, error: null, isLoading: false });
  },
}));

export function useCartItemCount(cart: CartWithItems | null): number {
  return cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;
}
