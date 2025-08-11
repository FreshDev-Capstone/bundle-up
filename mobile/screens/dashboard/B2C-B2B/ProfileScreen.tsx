import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { MenuItem } from "../../../../shared/types";
import { orderService } from "../../../services/apiService";
import EditProfileModal from "../../../components/profile/EditProfileModal";
import styles from "./ProfileScreen.styles";

const menuItems: MenuItem[] = [
  { key: "edit", label: "Edit Profile", screen: "EditProfile" },
  { key: "admin", label: "Admin Dashboard", adminOnly: true },
];

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { addToCart } = useCart();
  const navigation = useNavigation<any>();
  const [showEditModal, setShowEditModal] = useState(false);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch order history from API
  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);

      if (!user?.token) {
        console.error("User token not available");
        setOrderHistory([]);
        return;
      }

      const data = await orderService.getOrders(user.token);

      // Transform API data to match our interface
      const transformedOrders: Order[] = (data.data || []).map(
        (order: any) => ({
          id: order.id,
          orderNumber: order.order_number || `ORD-${order.id}`,
          date: new Date(order.created_at).toLocaleDateString(),
          total: Number(order.total) || 0,
          status: order.status || "pending",
          items: order.items || [],
        })
      );

      setOrderHistory(transformedOrders);
    } catch (error) {
      console.error("Error fetching order history:", error);
      setOrderHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuPress = (item: MenuItem) => {
    switch (item.key) {
      case "edit":
        setShowEditModal(true);
        break;
      case "admin":
        if (user?.accountType === "ADMIN") {
          // Navigate to admin dashboard
          // navigation.navigate("AdminDashboard");
          Alert.alert("Admin Dashboard", "Admin features coming soon!");
        }
        break;
      default:
        if (item.screen) {
          navigation.navigate(item.screen);
        }
        break;
    }
  };

  const handleReorder = (order: Order) => {
    Alert.alert("Reorder", `Would you like to reorder ${order.orderNumber}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reorder",
        onPress: () => {
          // Add all items from the order to cart
          order.items.forEach((item: OrderItem) => {
            // Mock product data - in real app, you'd fetch product details
            const mockProduct = {
              id: `product-${item.name.toLowerCase().replace(/\s+/g, "-")}`,
              name: item.name,
              description: item.name,
              category: "Eggs",
              product_count: 1,
              image_url: "",
              b2c_price: item.price,
              b2b_price: item.price,
              inventory_by_carton: 100,
              inventory_by_box: 100,
              is_available: true,
              is_active: true,
              created_at: new Date().toISOString(),
            };
            addToCart(mockProduct, item.quantity);
          });
          Alert.alert("Success", "Items added to cart!");
        },
      },
    ]);
  };

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.adminOnly) {
      return user?.accountType === "ADMIN";
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>
          Welcome
          {user?.firstName
            ? `, ${user.firstName}`
            : user?.email
            ? `, ${user.email}`
            : ""}
          !
        </Text>
        <Text style={styles.accountType}>
          {user?.accountType === "ADMIN"
            ? "Administrator"
            : user?.accountType === "B2B"
            ? "Business Account"
            : "Personal Account"}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          {filteredMenuItems.map((item: MenuItem) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.menuItem, item.adminOnly && styles.adminItem]}
              onPress={() => handleMenuPress(item)}
            >
              <Text
                style={[styles.menuLabel, item.adminOnly && styles.adminLabel]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order History */}
        <View style={styles.orderSection}>
          <View style={styles.orderSectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <View style={styles.orderHeaderButtons}>
              <TouchableOpacity
                onPress={fetchOrderHistory}
                style={styles.refreshButton}
              >
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
              {orderHistory.length > 3 && (
                <TouchableOpacity
                  onPress={() => navigation.navigate("OrderHistory")}
                  style={styles.viewAllButton}
                >
                  <Text style={styles.viewAllButtonText}>View All</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.loadingText}>Loading orders...</Text>
            </View>
          ) : orderHistory.length > 0 ? (
            orderHistory.slice(0, 3).map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => handleReorder(order)}
              >
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View style={styles.orderItems}>
                  {order.items.map((item: OrderItem, index: number) => (
                    <Text key={index} style={styles.orderItem}>
                      • {item.name} (Qty: {item.quantity})
                    </Text>
                  ))}
                </View>
                <View style={styles.orderFooter}>
                  <Text
                    style={[
                      styles.orderStatus,
                      order.status === "Processing" &&
                        styles.orderStatusProcessing,
                      order.status === "Delivered" &&
                        styles.orderStatusDelivered,
                    ]}
                  >
                    {order.status}
                  </Text>
                  <Text style={styles.orderTotal}>
                    ${(Number(order.total) || 0).toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyOrders}>
              <Text style={styles.emptyOrdersText}>No orders yet</Text>
              <Text style={styles.emptyOrdersSubtext}>
                Your order history will appear here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sign Out Button at Bottom */}
      <View style={styles.signOutContainer}>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => {
            Alert.alert("Sign Out", "Are you sure you want to sign out?", [
              { text: "Cancel", style: "cancel" },
              { text: "Sign Out", style: "destructive", onPress: logout },
            ]);
          }}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <EditProfileModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </SafeAreaView>
  );
}
