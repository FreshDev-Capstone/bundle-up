import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { orderService } from "../services/apiService";

export interface OrderHistoryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  product_color?: string;
  product_count: number;
  image_url: string;
  b2c_price: number;
  b2b_price: number;
  inventory_by_carton: number;
  inventory_by_box: number;
  is_available: boolean;
  is_active: boolean;
  created_at: string;
  lastOrdered: string;
  orderCount: number;
  totalQuantity: number;
  orderDates: string[];
}

export const useOrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchOrderHistory = async () => {
    if (!user?.token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(
        `[useOrderHistory] Fetching order history for user: ${user.id}`
      );

      const response = await orderService.getOrderHistory(user.token);
      console.log(
        `[useOrderHistory] Received ${
          response.data?.orderHistory?.length || 0
        } order history items`
      );

      if (response.success && response.data?.orderHistory) {
        setOrderHistory(response.data.orderHistory);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("[useOrderHistory] Error fetching order history:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch order history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, [user?.id, user?.token]);

  return { orderHistory, loading, error, refresh: fetchOrderHistory };
};
