import { Product } from "./product";

// Cart related types
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  updatedAt: string;
}

export interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string | number, newQuantity: number) => void;
  removeFromCart: (productId: string | number) => void;
  clearCart: () => void;
  refreshCart: () => void;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

export interface OrderSummary {
  subtotal: number;
  discountAmount: number;
  discountedSubtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}
