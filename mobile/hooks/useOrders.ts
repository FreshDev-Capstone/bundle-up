import { useState, useEffect } from "react";
import { Order } from "../../shared/types/order";
import { fetchHandler } from "@/utils/fetchingUtils";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetchHandler(`/orders`);
        const data = await response.json();
        setOrders(data);

        // Mock data for now
        // const mockOrders: Order[] = [];
        // setOrders(mockOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const refetch = () => {
    setError(null);
    setLoading(true);
    // Re-fetch orders
  };

  return { orders, loading, error, refetch };
};
