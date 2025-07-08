import React from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { MenuItem } from "../../../shared/types";
import styles from "./ProfileScreen.styles";

const menuItems: MenuItem[] = [
  { key: "edit", label: "Edit Profile", screen: "EditProfile" },
  { key: "orders", label: "Order History", screen: "OrderHistory" },
  { key: "payments", label: "Payment Methods", screen: "PaymentMethods" },
  {
    key: "addresses",
    label: "Delivery Addresses",
    screen: "DeliveryAddresses",
  },
  { key: "settings", label: "Settings", screen: "Settings" },
  { key: "admin", label: "Admin Dashboard", adminOnly: true },
  { key: "logout", label: "Sign Out" },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();

  const handleMenuPress = (item: MenuItem) => {
    switch (item.key) {
      case "logout":
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
          { text: "Cancel", style: "cancel" },
          { text: "Sign Out", style: "destructive", onPress: logout },
        ]);
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

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.adminOnly) {
      return user?.accountType === "ADMIN";
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>
          Welcome{user?.firstName ? `, ${user.firstName}` : ""}!
        </Text>
        <Text style={styles.accountType}>
          {user?.accountType === "ADMIN"
            ? "Administrator"
            : user?.accountType === "B2B"
            ? "Business Account"
            : "Personal Account"}
        </Text>
      </View>

      <FlatList
        data={filteredMenuItems}
        renderItem={({ item }: { item: MenuItem }) => (
          <TouchableOpacity
            style={[
              styles.menuItem,
              item.key === "logout" && styles.logoutItem,
              item.adminOnly && styles.adminItem,
            ]}
            onPress={() => handleMenuPress(item)}
          >
            <Text
              style={[
                styles.menuLabel,
                item.key === "logout" && styles.logoutLabel,
                item.adminOnly && styles.adminLabel,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item: MenuItem) => item.key}
        style={styles.menuList}
      />
    </View>
  );
}
