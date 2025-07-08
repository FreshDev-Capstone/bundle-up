import {
  fetchHandler,
  getPatchOptions,
  getPostOptions,
  deleteOptions,
} from "../utils/fetchingUtils";
import { CartItem, Cart } from "../../shared/types";

const baseUrl = "http://localhost:3001/api/cart";

export const getCart = async () => {
  return await fetchHandler(baseUrl);
};

export const addToCart = async (productId: string, quantity: number = 1) => {
  if (!productId) {
    console.error("addToCart: productId is required");
    return [null, "Product ID is required"];
  }

  try {
    const result = await fetchHandler(
      `${baseUrl}/add`,
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
      `${baseUrl}/update/${itemId}`,
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
    const result = await fetchHandler(
      `${baseUrl}/remove/${itemId}`,
      deleteOptions
    );
    return result;
  } catch (error) {
    console.error("Remove from cart error:", error);
    return [null, error];
  }
};

export const clearCart = async () => {
  try {
    const result = await fetchHandler(`${baseUrl}/clear`, deleteOptions);
    return result;
  } catch (error) {
    console.error("Clear cart error:", error);
    return [null, error];
  }
};
