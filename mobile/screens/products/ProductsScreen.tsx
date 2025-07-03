import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
// import { useProducts } from '../hooks/useProducts';
import ProductCard from "../../components/product/ProductCard/ProductCard";
import { Product } from "../../../shared/types/product";
// import { Colors } from "../../shared/constants/Colors";
import styles from "./ProductsScreen.styles";

export default function ProductsScreen() {
  const { products, loading, error } = useProducts();

  const handleProductPress = (product: Product) => {
    // Product press handler - can be extended for navigation later
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Store</Text>
      <Text style={styles.subtitle}>Found {products.length} products</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={handleProductPress} />
        )}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
