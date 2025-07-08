import { useState, useCallback } from "react";
import { CartItem, Product, OrderSummary } from "../types";
import {
  calculateOrderSummary,
  calculateCartQuantity,
} from "../utils/calculations";

export interface UseCartOptions {
  taxRate?: number;
  freeShippingThreshold?: number;
  standardShippingCost?: number;
}

export const useCart = (options: UseCartOptions = {}) => {
  const {
    taxRate = 0.08,
    freeShippingThreshold = 50,
    standardShippingCost = 5.99,
  } = options;

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCart = useCallback(
    (
      product: Product,
      quantity: number = 1,
      userType: "b2c" | "b2b" = "b2c"
    ) => {
      setItems((prevItems: CartItem[]) => {
        const existingItem = prevItems.find(
          (item: CartItem) => item.productId === product.id.toString()
        );
        const price = userType === "b2b" ? product.b2bPrice : product.b2cPrice;

        if (existingItem) {
          return prevItems.map((item: CartItem) =>
            item.productId === product.id.toString()
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          productId: product.id.toString(),
          quantity,
          price,
          product,
        };

        return [...prevItems, newItem];
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: string) => {
    setItems((prevItems: CartItem[]) =>
      prevItems.filter((item: CartItem) => item.productId !== productId)
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setItems((prevItems: CartItem[]) =>
        prevItems.map((item: CartItem) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const orderSummary: OrderSummary = calculateOrderSummary(
    items,
    taxRate,
    0, // discount percent
    freeShippingThreshold,
    standardShippingCost
  );

  const totalItems = calculateCartQuantity(items);
  const isEmpty = items.length === 0;

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    orderSummary,
    totalItems,
    isEmpty,
    loading,
    error,
  };
};
