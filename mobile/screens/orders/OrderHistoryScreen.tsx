import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";

// Mock order data - replace with actual API call
const mockOrders = [
  {
    id: "1",
    orderNumber: "ORD-001",
    date: "2024-01-15",
    total: 45.99,
    status: "Delivered",
    items: ["Cage Free Brown Eggs", "Organic Milk"],
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    date: "2024-01-10",
    total: 32.5,
    status: "Delivered",
    items: ["Pasture Raised Eggs", "Duck Eggs"],
  },
  {
    id: "3",
    orderNumber: "ORD-003",
    date: "2024-01-05",
    total: 28.75,
    status: "Delivered",
    items: ["Organic Brown Eggs"],
  },
  {
    id: "4",
    orderNumber: "ORD-004",
    date: "2024-01-01",
    total: 55.25,
    status: "Processing",
    items: ["Heirloom Blue Eggs", "Quail Eggs", "Hard Boiled Eggs"],
  },
];

interface OrderHistoryScreenProps {
  navigation: any;
}

export default function OrderHistoryScreen({
  navigation,
}: OrderHistoryScreenProps) {
  const renderOrderItem = ({ item }: { item: (typeof mockOrders)[0] }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
      </View>
      <View style={styles.orderItems}>
        {item.items.map((orderItem: string, index: number) => (
          <Text key={index} style={styles.orderItem}>
            • {orderItem}
          </Text>
        ))}
      </View>
      <View style={styles.orderFooter}>
        <Text
          style={[
            styles.orderStatus,
            item.status === "Delivered" && styles.statusDelivered,
            item.status === "Processing" && styles.statusProcessing,
          ]}
        >
          {item.status}
        </Text>
        <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Order History</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={mockOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  placeholder: {
    width: 32,
  },
  listContainer: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  orderDate: {
    fontSize: 14,
    color: "#666666",
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 2,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  statusDelivered: {
    color: "#4CAF50",
  },
  statusProcessing: {
    color: "#FF9800",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
});
