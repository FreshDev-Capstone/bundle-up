import React, { createContext, useContext, ReactNode } from "react";
import { create } from "zustand";
import { Product, CartItem, CartState } from "../../shared/types";

const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addToCart: (product, quantity = 1) => {
    const items = get().items;
    const existing = items.find((i) => i.productId === product.id.toString());

    // Check inventory availability
    const availableInventory =
      product.inventory_by_carton || product.inventory_by_box || 0;
    const currentQuantity = existing ? existing.quantity : 0;
    const newTotalQuantity = currentQuantity + quantity;

    if (newTotalQuantity > availableInventory) {
      throw new Error(
        `Only ${availableInventory} items available. You already have ${currentQuantity} in your cart.`
      );
    }

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
        price: product.b2cPrice || product.b2c_price, // Default to B2C price, could be made dynamic based on user type
        product,
      };
      set({ items: [...items, newItem] });
    }
  },
  updateQuantity: (productId, newQuantity) => {
    const items = get().items;
    const item = items.find((i) => i.productId === productId.toString());

    if (!item || !item.product) {
      throw new Error("Item not found in cart");
    }

    // Check inventory availability
    const availableInventory =
      item.product.inventory_by_carton || item.product.inventory_by_box || 0;

    if (newQuantity > availableInventory) {
      throw new Error(`Only ${availableInventory} items available.`);
    }

    if (newQuantity <= 0) {
      set({
        items: items.filter((i) => i.productId !== productId.toString()),
      });
    } else {
      set({
        items: items.map((i) =>
          i.productId === productId.toString()
            ? { ...i, quantity: newQuantity }
            : i
        ),
      });
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
