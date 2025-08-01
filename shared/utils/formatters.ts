/**
 * Format a price as currency string
 * @param price - The price to format
 * @param currency - The currency symbol (default: '$')
 * @returns Formatted price string
 */
export const formatPrice = (price: number, currency: string = "$"): string => {
  return `${currency}${price.toFixed(2)}`;
};

/**
 * Calculate total price including tax
 * @param subtotal - The subtotal before tax
 * @param taxRate - The tax rate (e.g., 0.08 for 8%)
 * @returns Total price including tax
 */
export const calculateTotalWithTax = (
  subtotal: number,
  taxRate: number
): number => {
  return subtotal * (1 + taxRate);
};

/**
 * Calculate shipping cost based on order value
 * @param orderValue - The total order value
 * @param freeShippingThreshold - The minimum order value for free shipping
 * @param standardShippingCost - The standard shipping cost
 * @returns Shipping cost
 */
export const calculateShippingCost = (
  orderValue: number,
  freeShippingThreshold: number = 50,
  standardShippingCost: number = 5.99
): number => {
  return orderValue >= freeShippingThreshold ? 0 : standardShippingCost;
};

/**
 * Calculate discount amount
 * @param originalPrice - The original price
 * @param discountPercent - The discount percentage (e.g., 20 for 20%)
 * @returns Discount amount
 */
export const calculateDiscount = (
  originalPrice: number,
  discountPercent: number
): number => {
  return originalPrice * (discountPercent / 100);
};

/**
 * Calculate final price after discount
 * @param originalPrice - The original price
 * @param discountPercent - The discount percentage
 * @returns Final price after discount
 */
export const calculateDiscountedPrice = (
  originalPrice: number,
  discountPercent: number
): number => {
  return originalPrice - calculateDiscount(originalPrice, discountPercent);
};

/**
 * Format a number with commas
 * @param num - The number to format
 * @returns Formatted number string
 */
export const formatNumberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Parse a price string to number
 * @param priceString - The price string (e.g., "$10.99")
 * @returns Parsed price as number
 */
export const parsePriceString = (priceString: string): number => {
  return parseFloat(priceString.replace(/[^0-9.]/g, ""));
};
