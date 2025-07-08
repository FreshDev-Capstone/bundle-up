import React from "react";
import { ScrollView, SafeAreaView } from "react-native";
import ProductDetails from "../../components/product/ProductDetails/ProductDetails";
import { Product } from "../../../shared/types/product";
import styles from "./ProductDetailsScreen.styles";

interface ProductDetailsScreenProps {
  product: Product;
}

export default function ProductDetailsScreen({
  product,
}: ProductDetailsScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <ProductDetails product={product} />
      </ScrollView>
    </SafeAreaView>
  );
}
