import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import { useProducts } from "../../hooks/useProducts";
import ProductCard from "../../components/product/ProductCard/ProductCard";
import ProductDetails from "../../components/product/ProductDetails/ProductDetails";
import { Product } from "../../../shared/types/product";
import { Colors } from "../../constants/Colors";
import styles from "./ProductsScreen.styles";
import { X, Package, User } from "lucide-react-native";
import useBranding from "../../hooks/useBranding";
import { useCart } from "../../context/CartContext";
import { useNavigation } from "@react-navigation/native";

export default function ProductsScreen() {
  const { products, loading, error } = useProducts();
  const { brand } = useBranding();
  const { addToCart } = useCart();
  const navigation = useNavigation<any>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  const [addedProductName, setAddedProductName] = useState("");

  // Get unique categories from products
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  ).sort();

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleProductPress = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product, 1);
      setAddedProductName(product.name);
      setShowAddedNotification(true);
      setTimeout(() => setShowAddedNotification(false), 2000);
      console.log("Added to cart:", product.name);
      handleCloseModal();
    },
    [addToCart, handleCloseModal]
  );

  const renderCategoryFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoryContainer}
      contentContainerStyle={styles.categoryContent}
    >
      <TouchableOpacity
        style={[
          styles.categoryChip,
          !selectedCategory && styles.categoryChipActive,
        ]}
        onPress={() => setSelectedCategory(null)}
      >
        <Text
          style={[
            styles.categoryText,
            !selectedCategory && styles.categoryTextActive,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryChip,
            selectedCategory === category && styles.categoryChipActive,
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Company Logo and My Account */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {brand?.logo ? (
            <Image source={{ uri: brand.logo }} style={styles.logoImage} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>{brand?.name || "BundleUp"}</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.accountButton}
            onPress={() => navigation.navigate("profile")}
          >
            <User size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Package
            size={20}
            color={Colors.light.text}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.tabIconDefault}
          />
        </View>
      </View>

      {/* Category Filters */}
      {renderCategoryFilter()}

      {/* Results Count */}
      <Text style={styles.resultsText}>
        {filteredProducts.length} product
        {filteredProducts.length !== 1 ? "s" : ""} found
      </Text>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item: Product) => item.id.toString()}
        renderItem={({ item }: { item: Product }) => (
          <ProductCard
            product={item}
            onPress={handleProductPress}
            onAddToCart={handleAddToCart}
          />
        )}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
      />

      {/* Added to Cart Notification */}
      {showAddedNotification && (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>
            ✓ {addedProductName} added to cart
          </Text>
        </View>
      )}

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
              <X size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          {selectedProduct && (
            <ProductDetails
              product={selectedProduct}
              onAddToCart={handleAddToCart}
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
