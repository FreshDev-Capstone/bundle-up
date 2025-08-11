import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RefreshCw } from "lucide-react-native";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import ProductCard from "../../components/product/ProductCard/ProductCard";
import { useOrderHistory } from "../../hooks/useOrderHistory";
import styles from "./ReorderScreen.styles";

interface ReorderScreenProps {
  navigation: any;
}

export default function ReorderScreen({ navigation }: ReorderScreenProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { orderHistory, loading, error, refresh } = useOrderHistory();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter items based on search query
  const filteredOrderHistory = orderHistory.filter(
    (item: any) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product: any) => {
    addToCart(product, 1); // Default quantity of 1
    Alert.alert("Added to Cart", `${product.name} added to your cart!`);
  };

  const handleReorderAll = () => {
    if (orderHistory.length === 0) {
      Alert.alert("No Items", "No items to reorder.");
      return;
    }

    Alert.alert(
      "Reorder All Items",
      `Add all ${orderHistory.length} previously ordered items to your cart?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reorder All",
          onPress: () => {
            orderHistory.forEach((item) => {
              addToCart(item, 1);
            });
            Alert.alert("Success", "All items added to cart!");
          },
        },
      ]
    );
  };

  const handleRefresh = () => {
    refresh();
  };

  const renderOrderHistoryItem = ({ item }: { item: any }) => (
    <ProductCard product={item} onAddToCart={handleAddToCart} />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Loading your order history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Error Loading Order History</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reorder</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#10B981" />
          ) : (
            <RefreshCw size={24} color="#10B981" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search previously ordered items..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Reorder All Button */}
      {orderHistory.length > 0 && (
        <View style={styles.reorderAllContainer}>
          <TouchableOpacity
            style={styles.reorderAllButton}
            onPress={handleReorderAll}
          >
            <Text style={styles.reorderAllButtonText}>
              Reorder All Items ({orderHistory.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Previously Ordered Items */}
      {filteredOrderHistory.length > 0 ? (
        <FlatList
          data={filteredOrderHistory}
          renderItem={renderOrderHistoryItem}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          numColumns={2}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            {searchQuery ? "No items found" : "No order history"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery
              ? "Try adjusting your search terms"
              : "Items you've ordered before will appear here"}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
