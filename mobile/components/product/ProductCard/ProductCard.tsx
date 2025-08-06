import React from "react";
import { Text, Image, TouchableOpacity, View } from "react-native";
import { Product } from "../../../../shared/types/product";
import { CirclePlus } from "lucide-react-native";
import { useAuth } from "../../../context/AuthContext";
import { getImageUrl } from "../../../utils/imageUtils";
import styles from "./ProductCard.styles";

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onPress,
  onAddToCart,
}: ProductCardProps) {
  const { user } = useAuth();

  const handlePress = () => {
    onPress?.(product);
  };

  const handleAddPress = (e: any) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  // Determine which price to show based on user account type
  const getDisplayPrice = () => {
    // Debug logging
    console.log("[ProductCard] Product data:", {
      name: product.name,
      b2cPrice: product.b2cPrice,
      b2c_price: product.b2c_price,
      b2bPrice: product.b2bPrice,
      b2b_price: product.b2b_price,
    });

    // If user is not logged in, show B2C price by default
    if (!user) {
      const price = Number(product.b2cPrice || product.b2c_price || 0);
      return price.toFixed(2);
    }

    // Show price based on user account type
    switch (user.accountType) {
      case "B2B":
        const b2bPrice = Number(product.b2bPrice || product.b2b_price || 0);
        return b2bPrice.toFixed(2);
      case "B2C":
      default:
        const b2cPrice = Number(product.b2cPrice || product.b2c_price || 0);
        return b2cPrice.toFixed(2);
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

  const imageUrl = getImageUrl(product.image_url);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        onError={(error: any) => {
          console.error(
            `[ProductCard] Failed to load image for ${product.name}:`,
            error
          );
        }}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
        <CirclePlus size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Admin users see both prices */}
        {user?.accountType === "ADMIN" ? (
          <View style={styles.adminPriceContainer}>
            <Text style={styles.adminPrice}>
              Retail: $
              {Number(product.b2cPrice || product.b2c_price || 0).toFixed(2)} |
              Wholesale: $
              {Number(product.b2bPrice || product.b2b_price || 0).toFixed(2)}
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
      </View>
    </TouchableOpacity>
  );
}
