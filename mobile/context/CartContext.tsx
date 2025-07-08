import React, { createContext, useContext, ReactNode } from "react";
import { create } from "zustand";
import { Product, CartItem, CartState } from "../../shared/types";

const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addToCart: (product, quantity = 1) => {
    const items = get().items;
    const existing = items.find((i) => i.productId === product.id.toString());
    if (existing) {
      set({
        items: items.map((i) =>
          i.productId === product.id.toString()
            ? { ...i, quantity: i.quantity + quantity }
            : i
        ),
      });
    } else {
      const newItem: CartItem = {
        id: `${Date.now()}-${product.id}`,
        productId: product.id.toString(),
        quantity,
        price: product.b2cPrice, // Default to B2C price, could be made dynamic based on user type
        product,
      };
      set({ items: [...items, newItem] });
    }
  },
  removeFromCart: (productId) =>
    set({
      items: get().items.filter((i) => i.productId !== productId.toString()),
    }),
  clearCart: () => set({ items: [] }),
  refreshCart: () => {
    // This could fetch fresh cart data from the server
    // For now, it's a placeholder
  },
}));

const CartContext = createContext<CartState | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const store = useCartStore();
  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
