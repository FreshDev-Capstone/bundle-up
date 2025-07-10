import React, { useState } from "react";
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
  const [imageError, setImageError] = useState(false);

  const handlePress = () => {
    onPress?.(product);
  };

  // Generate a placeholder image URL based on product category and color
  const getPlaceholderImage = () => {
    const colors = ['#8B4513', '#DEB887', '#F5DEB3', '#CD853F']; // Brown tones for eggs
    const colorIndex = (product.id || 0) % colors.length;
    return `https://via.placeholder.com/200x150/${colors[colorIndex].substring(1)}/FFFFFF?text=${encodeURIComponent(product.eggColor || 'Egg')}`;
  };

  const getImageSource = () => {
    if (imageError || !product.imageUrl) {
      return { uri: getPlaceholderImage() };
    }
    
    // Handle relative URLs by making them absolute
    if (product.imageUrl.startsWith('/')) {
      // For now, use placeholder since we don't have actual egg images
      return { uri: getPlaceholderImage() };
    }
    
    return { uri: product.imageUrl };
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
      <Image 
        source={getImageSource()} 
        style={styles.image} 
        onError={() => setImageError(true)}
      />
      <CirclePlus style={styles.addButton} />
      <Text style={styles.name} numberOfLines={2}>{product.name}</Text>

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
