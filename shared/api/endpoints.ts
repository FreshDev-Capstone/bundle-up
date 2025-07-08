import {
  fetchHandler,
  getPostOptions,
  getPatchOptions,
  deleteOptions,
} from "../utils/fetchingUtils";
import { Product, User, Order, CartItem } from "../types";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001/api";

// Product Endpoints
export const getAllProducts = async () => {
  return await fetchHandler(`${BASE_URL}/products`);
};

export const getProductById = async (id: number) => {
  return await fetchHandler(`${BASE_URL}/products/${id}`);
};

export const getProductsByCategory = async (category: string) => {
  return await fetchHandler(`${BASE_URL}/products/category/${category}`);
};

export const createProduct = async (productData: Partial<Product>) => {
  return await fetchHandler(
    `${BASE_URL}/products`,
    getPostOptions(productData)
  );
};

export const updateProduct = async (
  id: number,
  productData: Partial<Product>
) => {
  return await fetchHandler(
    `${BASE_URL}/products/${id}`,
    getPatchOptions(productData)
  );
};

export const deleteProduct = async (id: number) => {
  return await fetchHandler(`${BASE_URL}/products/${id}`, deleteOptions);
};

// Auth Endpoints
export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  return await fetchHandler(
    `${BASE_URL}/auth/login`,
    getPostOptions(credentials)
  );
};

export const register = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  accountType: "B2B" | "B2C";
}) => {
  return await fetchHandler(
    `${BASE_URL}/auth/register`,
    getPostOptions(userData)
  );
};

export const getUserProfile = async () => {
  return await fetchHandler(`${BASE_URL}/auth/profile`);
};

// Cart Endpoints
export const getCart = async () => {
  return await fetchHandler(`${BASE_URL}/cart`);
};

export const addToCart = async (productId: string, quantity: number) => {
  return await fetchHandler(
    `${BASE_URL}/cart/add`,
    getPostOptions({ productId, quantity })
  );
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  return await fetchHandler(
    `${BASE_URL}/cart/update`,
    getPatchOptions({ itemId, quantity })
  );
};

export const removeFromCart = async (itemId: string) => {
  return await fetchHandler(`${BASE_URL}/cart/remove/${itemId}`, deleteOptions);
};

export const clearCart = async () => {
  return await fetchHandler(`${BASE_URL}/cart/clear`, deleteOptions);
};

// Order Endpoints
export const getAllOrders = async () => {
  return await fetchHandler(`${BASE_URL}/orders`);
};

export const getOrderById = async (id: string) => {
  return await fetchHandler(`${BASE_URL}/orders/${id}`);
};

export const createOrder = async (orderData: any) => {
  return await fetchHandler(`${BASE_URL}/orders`, getPostOptions(orderData));
};
