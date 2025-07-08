import React from "react";
import { Text, Image, TouchableOpacity, View } from "react-native";
import { Product } from "../../../../shared/types/product";
import { CirclePlus } from "lucide-react-native";
import { useAuth } from "../../../context/AuthContext";
import styles from "./ProductCard.styles";

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const { user } = useAuth();

  const handlePress = () => {
    onPress?.(product);
  };

  // Determine which price to show based on user account type
  const getDisplayPrice = () => {
    // If user is not logged in, show B2C price by default
    if (!user) return product.b2cPrice.toFixed(2);

    // Show price based on user account type
    switch (user.accountType) {
      case "B2B":
        return product.b2bPrice.toFixed(2);
      case "B2C":
      default:
        return product.b2cPrice.toFixed(2);
    }
  };

  const getPriceLabel = () => {
    if (!user) return "";

    switch (user.accountType) {
      case "B2B":
        return "Wholesale";
      case "B2C":
        return "Retail";
      default:
        return "";
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <CirclePlus style={styles.addButton} />
      <Text style={styles.name}>{product.name}</Text>

      {/* Admin users see both prices */}
      {user?.accountType === "ADMIN" ? (
        <View style={styles.adminPriceContainer}>
          <Text style={styles.adminPrice}>
            Retail: ${product.b2cPrice.toFixed(2)} | Wholesale: $
            {product.b2bPrice.toFixed(2)}
          </Text>
        </View>
      ) : (
        <View style={styles.priceContainer}>
          {getPriceLabel() && (
            <Text style={styles.priceLabel}>{getPriceLabel()}</Text>
          )}
          <Text style={styles.price}>${getDisplayPrice()}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
