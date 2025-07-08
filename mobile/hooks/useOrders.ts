import { useState, useEffect } from "react";
import { Order } from "../../shared/types/order";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch('/api/orders');
        // const data = await response.json();
        // setOrders(data);

        // Mock data for now
        const mockOrders: Order[] = [];
        setOrders(mockOrders);
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
