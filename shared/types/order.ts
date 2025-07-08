import { Address } from "./address";
// Removed PaymentMethod import - payment functionality removed
import { Product } from "./product";

// Order related types
export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  deliveryAddress: Address;
  // Removed paymentMethod - payment functionality removed
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  notes?: string;
}

export interface UpdateOrderStatusData {
  status: Order["status"];
}
