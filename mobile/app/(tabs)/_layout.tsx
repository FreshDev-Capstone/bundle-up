import React from "react";
import { Tabs } from "expo-router";
import { useCart } from "../../context/CartContext";
import { Egg, Repeat, ShoppingBasket, UserRound } from "lucide-react-native";

export default function TabLayout() {
  const { state } = useCart();
  const itemCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <Tabs>
      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          tabBarLabel: "Products",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Egg size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarLabel: "Cart",
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <ShoppingBasket size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reorder"
        options={{
          title: "Reorder",
          tabBarLabel: "Reorder",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Repeat size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <UserRound size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
