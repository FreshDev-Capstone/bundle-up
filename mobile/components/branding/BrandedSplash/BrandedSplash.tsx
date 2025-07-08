import React from "react";
import { View, Text, Image } from "react-native";
import { useBrand } from "../../../context/BrandContext";
import styles from "./BrandedSplash.styles";

export default function BrandedSplash() {
  const { brand } = useBrand();
  if (!brand) return null;
  return (
    <View
      style={[styles.container, { backgroundColor: brand.colors.background }]}
    >
      <Image
        source={{ uri: brand.logo }}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.brandName, { color: brand.colors.primary }]}>
        {brand.name}
      </Text>
      <Text style={styles.type}>
        {brand.type === "B2B" ? "Business Portal" : "Customer Portal"}
      </Text>
    </View>
  );
}
