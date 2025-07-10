import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import styles from "./OrderHistoryScreen.styles";
import { Order } from "../../../../shared/types";
import { getAllOrders } from "../../../../shared/api/endpoints";

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const [data, error] = await getAllOrders();

      if (error) {
        console.error("Failed to fetch orders:", error);
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error("Order fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "#27ae60";
      case "shipped":
        return "#3498db";
      case "confirmed":
        return "#f39c12";
      case "pending":
        return "#e67e22";
      case "cancelled":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
        <Text style={styles.orderInfo}>{item.items.length} items</Text>
        <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No orders found</Text>
          <Text style={styles.emptySubtext}>
            Your order history will appear here once you make your first
            purchase.
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item: Order) => item.id}
          style={styles.ordersList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#3498db"]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
