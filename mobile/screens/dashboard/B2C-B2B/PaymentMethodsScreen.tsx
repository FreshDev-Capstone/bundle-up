import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PaymentMethodsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Methods</Text>
      <Text style={styles.comingSoon}>Coming Soon!</Text>
      <Text style={styles.description}>
        Payment functionality will be implemented in a future update.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  comingSoon: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
