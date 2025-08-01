import React from "react";
import { View, ActivityIndicator, ScrollView } from "react-native";
import { useProducts } from "../../../hooks/useProducts";
import ProductCard from "../ProductCard/ProductCard";
import { Product } from "../../../../shared/types/product";
import styles from "./ProductList.styles";

interface ProductListProps {
  onProductPress?: (product: Product) => void;
}

export default function ProductList({ onProductPress }: ProductListProps) {
  const { products, loading } = useProducts();

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        products?.map((product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPress={onProductPress}
          />
        ))
      )}
    </ScrollView>
  );
}
