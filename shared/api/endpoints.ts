import {
  fetchHandler,
  getPostOptions,
  getPatchOptions,
  deleteOptions,
} from "../utils/fetchingUtils";
import {
  Product,
  User,
  Order,
  CartItem,
  RegisterData,
  LoginCredentials,
} from "../types";
import { CreateOrderData } from "../types/order";

// Product Endpoints
export const createProduct = async (productData: Partial<Product>) => {
  if (!productData) {
    console.error("createProduct: productData is undefined");
    return [null, "No product data provided"];
  }
  try {
    const result = await fetchHandler("/products", getPostOptions(productData));
    return result;
  } catch (error) {
    console.error("Create product error:", error);
    return [null, error];
  }
};

export const getAllProducts = async () => {
  return await fetchHandler("/products");
};

export const getProduct = async (id: number) => {
  return await fetchHandler(`/products/${id}`);
};

export const updateProduct = async (
  productId: number,
  productData: Partial<Product>
) => {
  if (!productData) {
    console.error("updateProduct: productData is undefined");
    return [null, "No product data provided"];
  }
  try {
    const result = await fetchHandler(
      `/${productId}`,
      getPatchOptions(productData)
    );
    return result;
  } catch (error) {
    console.error("Update product error:", error);
    return [null, error];
  }
};

export const deleteProduct = async (id: number) => {
  return fetchHandler(`/products/${id}`, deleteOptions);
};

// Auth Endpoints
export const login = async (credentials: LoginCredentials) => {
  try {
    const [data, error] = await fetchHandler(
      `/auth/login`,
      getPostOptions(credentials)
    );
    if (error) {
      throw new Error(error.message || "Login failed");
    }
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const register = async (userData: RegisterData) => {
  try {
    const [data, error] = await fetchHandler(
      `/auth/register`,
      getPostOptions(userData)
    );
    if (error) {
      throw new Error(error.message || "Registration failed");
    }
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const getUserProfile = async () => {
  return await fetchHandler(`/auth/profile`);
};

// Cart Endpoints
export const getCart = async () => {
  return await fetchHandler("/cart");
};

export const addToCart = async (productId: string, quantity: number = 1) => {
  if (!productId) {
    console.error("addToCart: productId is required");
    return [null, "Product ID is required"];
  }

  try {
    const result = await fetchHandler(
      "/cart/add",
      getPostOptions({ productId, quantity })
    );
    return result;
  } catch (error) {
    console.error("Add to cart error:", error);
    return [null, error];
  }
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  if (!itemId || quantity < 0) {
    console.error("updateCartItem: valid itemId and quantity required");
    return [null, "Valid item ID and quantity are required"];
  }

  try {
    const result = await fetchHandler(
      `/cart/update/${itemId}`,
      getPatchOptions({ quantity })
    );
    return result;
  } catch (error) {
    console.error("Update cart item error:", error);
    return [null, error];
  }
};

export const removeFromCart = async (itemId: string) => {
  if (!itemId) {
    console.error("removeFromCart: itemId is required");
    return [null, "Item ID is required"];
  }

  try {
    const result = await fetchHandler(`/cart/remove/${itemId}`, deleteOptions);
    return result;
  } catch (error) {
    console.error("Remove from cart error:", error);
    return [null, error];
  }
};

export const clearCart = async () => {
  try {
    const result = await fetchHandler("/cart/clear", deleteOptions);
    return result;
  } catch (error) {
    console.error("Clear cart error:", error);
    return [null, error];
  }
};

// Order Endpoints
export const createOrder = async (orderData: CreateOrderData) => {
  if (!orderData || !orderData.items || orderData.items.length === 0) {
    console.error("createOrder: orderData is invalid");
    return [null, "Valid order data with items is required"];
  }

  try {
    const result = await fetchHandler("/orders", getPostOptions(orderData));
    return result;
  } catch (error) {
    console.error("Create order error:", error);
    return [null, error];
  }
};

export const getAllOrders = async () => {
  return await fetchHandler("/orders");
};

export const getOrder = async (id: string) => {
  return await fetchHandler(`/orders/${id}`);
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"]
) => {
  if (!orderId || !status) {
    console.error("updateOrderStatus: orderId and status are required");
    return [null, "Order ID and status are required"];
  }

  try {
    const result = await fetchHandler(
      `/orders/${orderId}/status`,
      getPatchOptions({ status })
    );
    return result;
  } catch (error) {
    console.error("Update order status error:", error);
    return [null, error];
  }
};

export const cancelOrder = async (id: string) => {
  if (!id) {
    console.error("cancelOrder: order ID is required");
    return [null, "Order ID is required"];
  }

  try {
    const result = await fetchHandler(
      `/orders/${id}/cancel`,
      getPatchOptions({ status: "cancelled" })
    );
    return result;
  } catch (error) {
    console.error("Cancel order error:", error);
    return [null, error];
  }
};

export const deleteOrder = async (id: string) => {
  return fetchHandler(`/orders/${id}`, deleteOptions);
};

// Address Endpoints
import { CreateAddressData } from "../types/address";

export const getAllAddresses = async () => {
  return await fetchHandler("/addresses");
};

export const getAddress = async (id: string) => {
  return await fetchHandler(`/addresses/${id}`);
};

export const createAddress = async (addressData: CreateAddressData) => {
  if (!addressData || !addressData.street || !addressData.city) {
    console.error("createAddress: required address data missing");
    return [null, "Street and city are required"];
  }

  try {
    const result = await fetchHandler(
      "/addresses",
      getPostOptions({
        ...addressData,
        country: addressData.country || "USA",
      })
    );
    return result;
  } catch (error) {
    console.error("Create address error:", error);
    return [null, error];
  }
};

export const updateAddress = async (
  addressId: string,
  addressData: Partial<CreateAddressData>
) => {
  if (!addressId || !addressData) {
    console.error("updateAddress: addressId and data are required");
    return [null, "Address ID and data are required"];
  }

  try {
    const result = await fetchHandler(
      `/addresses/${addressId}`,
      getPatchOptions(addressData)
    );
    return result;
  } catch (error) {
    console.error("Update address error:", error);
    return [null, error];
  }
};

export const deleteAddress = async (id: string) => {
  return fetchHandler(`/addresses/${id}`, deleteOptions);
};

export const setDefaultAddress = async (id: string) => {
  try {
    const result = await fetchHandler(
      `/addresses/${id}/default`,
      getPatchOptions({ isDefault: true })
    );
    return result;
  } catch (error) {
    console.error("Set default address error:", error);
    return [null, error];
  }
};
