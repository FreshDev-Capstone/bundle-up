import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { healthService, productService } from "../services/apiService";

export default function ApiTest() {
  const [healthStatus, setHealthStatus] = useState<string>("Not tested");
  const [productsStatus, setProductsStatus] = useState<string>("Not tested");
  const [loading, setLoading] = useState(false);

  const testHealth = async () => {
    setLoading(true);
    try {
      const response = await healthService.checkHealth();
      setHealthStatus(`✅ Health check passed: ${response.message}`);
    } catch (error) {
      setHealthStatus(
        `❌ Health check failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const testProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts({ limit: 5 });
      setProductsStatus(
        `✅ Products loaded: ${response.data?.length || 0} products`
      );
    } catch (error) {
      setProductsStatus(
        `❌ Products failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={testHealth}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Test Health Check</Text>
      </TouchableOpacity>

      <Text style={styles.status}>{healthStatus}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={testProducts}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Test Products API</Text>
      </TouchableOpacity>

      <Text style={styles.status}>{productsStatus}</Text>

      {loading && <Text style={styles.loading}>Loading...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  status: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    fontSize: 14,
  },
  loading: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#666",
  },
});
