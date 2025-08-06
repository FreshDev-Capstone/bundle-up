import React from "react";
import { Text, Image, TouchableOpacity, View, FlatList } from "react-native";
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

  // Parse and convert images array - handle both stringified and array cases
  let images: string[] = [];
  let rawImages: string[] = [];

  if (Array.isArray(product.images)) {
    rawImages = product.images;
  } else if (typeof product.images === "string") {
    try {
      rawImages = JSON.parse(product.images);
    } catch {
      rawImages = [];
    }
  }

  // Convert raw image paths to full URLs (like ProductDetails does)
  if (rawImages && rawImages.length > 0) {
    images = rawImages.map(getImageUrl);
  }

  // Debug logging for images
  console.log(`[ProductCard] ${product.name} - Raw images:`, rawImages);
  console.log(`[ProductCard] ${product.name} - Converted images:`, images);
  console.log(
    `[ProductCard] ${product.name} - First image URL:`,
    images[0] || "No images"
  );

  // Carousel state
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleScroll = (event: any) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x /
        event.nativeEvent.layoutMeasurement.width
    );
    setCurrentIndex(index);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {/* Image Carousel */}
      <View style={styles.carouselContainer}>
        {images.length > 0 ? (
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_: string, idx: number) => idx.toString()}
            renderItem={({ item, index }: { item: string; index: number }) => {
              console.log(
                `[ProductCard] Rendering image ${index} for ${product.name}:`,
                item
              );

              return (
                <Image
                  source={{ uri: item }}
                  style={styles.image}
                  resizeMode="cover"
                  onLoad={() => {
                    console.log(
                      `[ProductCard] Image ${index} loaded successfully for ${product.name}`
                    );
                  }}
                  onError={(error: any) => {
                    console.error(
                      `[ProductCard] Failed to load image ${index} for ${product.name}:`,
                      error
                    );
                    console.error(`[ProductCard] Image URL was:`, item);
                  }}
                />
              );
            }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
        ) : (
          <View
            style={[
              styles.image,
              {
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
              },
            ]}
          >
            <Text style={{ color: "#666", fontSize: 12 }}>No Image</Text>
          </View>
        )}
        {/* Carousel indicators */}
        {images.length > 1 && (
          <View style={styles.carouselIndicators}>
            {images.map((_: string, idx: number) => (
              <View
                key={idx}
                style={[
                  styles.carouselDot,
                  idx === currentIndex && styles.carouselDotActive,
                ]}
              />
            ))}
          </View>
        )}
        <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
          <CirclePlus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

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
