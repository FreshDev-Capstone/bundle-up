import { CartItem, OrderSummary } from "../types";
import {
  calculateTotalWithTax,
  calculateShippingCost,
  calculateDiscountedPrice,
} from "./formatters";

/**
 * Calculate cart subtotal
 * @param items - Array of cart items
 * @returns Subtotal amount
 */
export const calculateCartSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    // Use the price from the cart item, which should be the correct price for the user's brand
    return total + item.price * item.quantity;
  }, 0);
};

/**
 * Calculate total quantity of items in cart
 * @param items - Array of cart items
 * @returns Total quantity
 */
export const calculateCartQuantity = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Calculate order summary with all costs
 * @param items - Array of cart items
 * @param taxRate - Tax rate (default: 0.08 for 8%)
 * @param discountPercent - Discount percentage (default: 0)
 * @param freeShippingThreshold - Free shipping threshold (default: 50)
 * @param standardShippingCost - Standard shipping cost (default: 5.99)
 * @returns Complete order summary
 */
export const calculateOrderSummary = (
  items: CartItem[],
  taxRate: number = 0.08,
  discountPercent: number = 0,
  freeShippingThreshold: number = 50,
  standardShippingCost: number = 5.99
): OrderSummary => {
  const subtotal = calculateCartSubtotal(items);
  const discountAmount =
    discountPercent > 0 ? subtotal * (discountPercent / 100) : 0;
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * taxRate;
  const shipping = calculateShippingCost(
    discountedSubtotal,
    freeShippingThreshold,
    standardShippingCost
  );
  const total = discountedSubtotal + tax + shipping;

  return {
    subtotal,
    discountAmount,
    discountedSubtotal,
    tax,
    shipping,
    total,
    itemCount: calculateCartQuantity(items),
  };
};

/**
 * Check if cart qualifies for free shipping
 * @param items - Array of cart items
 * @param freeShippingThreshold - Free shipping threshold
 * @returns True if qualifies for free shipping
 */
export const qualifiesForFreeShipping = (
  items: CartItem[],
  freeShippingThreshold: number = 50
): boolean => {
  const subtotal = calculateCartSubtotal(items);
  return subtotal >= freeShippingThreshold;
};

/**
 * Calculate how much more is needed for free shipping
 * @param items - Array of cart items
 * @param freeShippingThreshold - Free shipping threshold
 * @returns Amount needed for free shipping (0 if already qualifies)
 */
export const amountNeededForFreeShipping = (
  items: CartItem[],
  freeShippingThreshold: number = 50
): number => {
  const subtotal = calculateCartSubtotal(items);
  return Math.max(0, freeShippingThreshold - subtotal);
};
