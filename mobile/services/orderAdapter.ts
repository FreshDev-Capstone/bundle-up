import {
  fetchHandler,
  getPatchOptions,
  getPostOptions,
  deleteOptions,
} from "../utils/fetchingUtils";
import { Order, OrderItem, Address } from "../../shared/types";

const baseUrl = "http://localhost:3001/api/orders";

export interface CreateOrderData {
  items: OrderItem[];
  deliveryAddress: Address;
  paymentMethod: string;
  notes?: string;
}

export const createOrder = async (orderData: CreateOrderData) => {
  if (!orderData || !orderData.items || orderData.items.length === 0) {
    console.error("createOrder: orderData is invalid");
    return [null, "Valid order data with items is required"];
  }

  try {
    const result = await fetchHandler(baseUrl, getPostOptions(orderData));
    return result;
  } catch (error) {
    console.error("Create order error:", error);
    return [null, error];
  }
};

export const getAllOrders = async () => {
  return await fetchHandler(baseUrl);
};

export const getOrder = async (id: string) => {
  return await fetchHandler(`${baseUrl}/${id}`);
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
      `${baseUrl}/${orderId}/status`,
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
      `${baseUrl}/${id}/cancel`,
      getPatchOptions({ status: "cancelled" })
    );
    return result;
  } catch (error) {
    console.error("Cancel order error:", error);
    return [null, error];
  }
};

export const deleteOrder = async (id: string) => {
  return fetchHandler(`${baseUrl}/${id}`, deleteOptions);
};
