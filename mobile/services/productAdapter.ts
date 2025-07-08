import {
  fetchHandler,
  getPatchOptions,
  getPostOptions,
  deleteOptions,
} from "../utils/fetchingUtils";
import { Product } from "../../shared/types";

// Use computer's IP address for physical device with Expo Go
const baseUrl = "http://localhost:3001/api/products";

export const createProduct = async (productData: Partial<Product>) => {
  if (!productData) {
    console.error("createProduct: productData is undefined");
    return [null, "No product data provided"];
  }
  try {
    const result = await fetchHandler(baseUrl, getPostOptions(productData));
    return result;
  } catch (error) {
    console.error("Create product error:", error);
    return [null, error];
  }
};

export const getAllProducts = async () => {
  return await fetchHandler(baseUrl);
};

export const getProduct = async (id: number) => {
  return await fetchHandler(`${baseUrl}/${id}`);
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
      `${baseUrl}/${productId}`,
      getPatchOptions(productData)
    );
    return result;
  } catch (error) {
    console.error("Update product error:", error);
    return [null, error];
  }
};

export const deleteProduct = async (id: number) => {
  return fetchHandler(`${baseUrl}/${id}`, deleteOptions);
};
