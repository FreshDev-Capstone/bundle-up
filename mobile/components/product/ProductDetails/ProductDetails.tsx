import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Text,
  Image,
} from "react-native";
import { Product } from "../../../../shared/types";
import { useAuth } from "../../../context/AuthContext";
import { getImageUrl } from "../../../utils/imageUtils";
import styles from "./ProductDetails.styles";

interface ProductDetailsProps {
  product?: Product;
  onAddToCart?: (product: Product) => void;
}

const { width: screenWidth } = Dimensions.get("window");

export default function ProductDetails({
  product,
  onAddToCart,
}: ProductDetailsProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const flatListRef = useRef<any>(null);
  const { user } = useAuth();

  // Determine which price to show based on user account type
  const getDisplayPrice = () => {
    if (!product) return "99.99";

    // If user is not logged in, show B2C price by default
    if (!user) return (product.b2cPrice || product.b2c_price).toFixed(2);

    // Show price based on user account type
    switch (user.accountType) {
      case "B2B":
        return (product.b2bPrice || product.b2b_price).toFixed(2);
      case "B2C":
      case "ADMIN": // Admin can see B2C prices
      default:
        return (product.b2cPrice || product.b2c_price).toFixed(2);
    }
  };

  const getPriceLabel = () => {
    if (!user) return "Price";

    switch (user.accountType) {
      case "B2B":
        return "Wholesale Price";
      case "B2C":
        return "Retail Price";
      case "ADMIN":
        return "Current Display Price"; // Admin sees both, this is just the main display
      default:
        return "Price";
    }
  };

  // Use product.images for the carousel, only use placeholders if images is missing or empty
  let productImages: string[] = [];
  if (product && Array.isArray(product.images) && product.images.length > 0) {
    productImages = product.images.map(getImageUrl);
  } else {
    productImages = [
      "https://via.placeholder.com/400x400/E3E3E3/999999?text=Product+Image+1",
      "https://via.placeholder.com/400x400/E3E3E3/999999?text=Product+Image+2",
      "https://via.placeholder.com/400x400/E3E3E3/999999?text=Product+Image+3",
      "https://via.placeholder.com/400x400/E3E3E3/999999?text=Product+Image+4",
    ];
  }

  const onScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffset / screenWidth);
    setActiveImageIndex(currentIndex);
  };

  const goToImage = (index: number) => {
    setActiveImageIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const renderImageItem = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item }}
        style={styles.productImage}
        resizeMode="cover"
      />
    </View>
  );

  const renderThumbnail = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => (
    <TouchableOpacity
      style={[
        styles.thumbnail,
        activeImageIndex === index && styles.activeThumbnail,
      ]}
      onPress={() => goToImage(index)}
    >
      <Image
        source={{ uri: item }}
        style={styles.thumbnailImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Main Image Carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={productImages}
          renderItem={renderImageItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          keyExtractor={(item: string, index: number) => `image-${index}`}
          getItemLayout={(data: any, index: number) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
        />

        {/* Image Counter */}
        <View style={styles.imageCounter}>
          <Text style={styles.counterText}>
            {activeImageIndex + 1} / {productImages.length}
          </Text>
        </View>

        {/* Dot Indicators */}
        <View style={styles.dotContainer}>
          {productImages.map((_: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                activeImageIndex === index && styles.activeDot,
              ]}
              onPress={() => goToImage(index)}
            />
          ))}
        </View>
      </View>

      {/* Thumbnail Row */}
      <View style={styles.thumbnailContainer}>
        <FlatList
          data={productImages}
          renderItem={renderThumbnail}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item: string, index: number) => `thumb-${index}`}
          contentContainerStyle={styles.thumbnailList}
        />
      </View>

      {/* Product Info */}
      <ScrollView style={styles.productInfo}>
        <Text style={styles.productName}>
          {product?.name || "Eggcellent Product"}
        </Text>

        {/* Admin users see both prices prominently */}
        {user?.accountType === "ADMIN" && product ? (
          <View style={styles.adminPriceContainer}>
            <Text style={styles.adminPriceTitle}>Admin View - All Pricing</Text>
            <View style={styles.priceRow}>
              <View style={styles.priceItem}>
                <Text style={styles.adminPriceLabel}>Retail (B2C)</Text>
                <Text style={styles.priceValue}>
                  ${(product.b2cPrice || product.b2c_price).toFixed(2)}
                </Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.adminPriceLabel}>Wholesale (B2B)</Text>
                <Text style={styles.priceValue}>
                  ${(product.b2bPrice || product.b2b_price).toFixed(2)}
                </Text>
              </View>
            </View>
            <Text style={styles.marginInfo}>
              Margin: $
              {(
                (product.b2cPrice || product.b2c_price) -
                (product.b2bPrice || product.b2b_price)
              ).toFixed(2)}
              (
              {(
                (((product.b2cPrice || product.b2c_price) -
                  (product.b2bPrice || product.b2b_price)) /
                  (product.b2bPrice || product.b2b_price)) *
                100
              ).toFixed(1)}
              %)
            </Text>
          </View>
        ) : (
          // Regular users see single price
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>{getPriceLabel()}</Text>
            <Text style={styles.productPrice}>${getDisplayPrice()}</Text>
          </View>
        )}

        <Text style={styles.productDescription}>
          {product?.description ||
            "This is a sample product description. Add detailed information about the product features, benefits, and specifications here."}
        </Text>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => product && onAddToCart?.(product)}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
