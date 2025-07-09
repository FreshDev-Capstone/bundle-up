import React from "react";
import { Tabs } from "expo-router";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Package, RefreshCw, ShoppingCart, User } from "lucide-react-native";

export default function TabLayout() {
  const { items } = useCart();
  const { isAuthenticated } = useAuth();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Tabs>
      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          tabBarLabel: "Products",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => {
            const Icon = Package as any;
            return <Icon size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarLabel: "Cart",
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarIcon: ({ color, size }: { color: string; size: number }) => {
            const Icon = ShoppingCart as any;
            return <Icon size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="reorder"
        options={{
          title: "Reorder",
          tabBarLabel: "Reorder",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => {
            const Icon = RefreshCw as any;
            return <Icon size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: isAuthenticated ? "Profile" : "",
          headerShown: isAuthenticated,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => {
            const Icon = User as any;
            return <Icon size={size} color={color} />;
          },
        }}
      />
    </Tabs>
  );
}
