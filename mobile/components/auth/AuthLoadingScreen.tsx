import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export default function AuthLoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007bff" />
      <Text style={styles.text}>Initializing...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});
