import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useProducts } from "../../hooks/useProducts";
import ProductCard from "../../components/product/ProductCard/ProductCard";
import ProductDetails from "../../components/product/ProductDetails/ProductDetails";
import { Product } from "../../../shared/types/product";
import { Colors } from "../../constants/Colors";
import styles from "./ProductsScreen.styles";
import { X } from "lucide-react-native";

export default function ProductsScreen() {
  const { products, loading, error } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
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
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: { item: any }) => (
          <ProductCard product={item} onPress={handleProductPress} />
        )}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Product Details Modal */}
      <Modal
        visible={!!selectedProduct}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}
            >
              <X />
            </TouchableOpacity>
          </View>

          {selectedProduct && <ProductDetails product={selectedProduct} />}
        </View>
      </Modal>
    </View>
  );
}
