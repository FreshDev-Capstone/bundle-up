import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { CartProvider } from "../context/CartContext";
import { Colors } from "../constants/colors";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
    </CartProvider>
  );
}
