import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useCart } from "../../context/CartContext";
import { CartItem } from "../../../shared/types";
import styles from "./CartScreen.styles";

export default function CartScreen() {
  const [updating, setUpdating] = useState<string | null>(null);
  const { items: cartItems, removeFromCart, addToCart, clearCart } = useCart();

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    setUpdating(itemId);
    try {
      // Find the cart item
      const item = cartItems.find((i) => i.id === itemId);
      if (item && item.product) {
        // Remove the old item and add with new quantity
        removeFromCart(parseInt(item.productId));
        addToCart(item.product, newQuantity);
      }
    } catch (error) {
      console.error("Update quantity error:", error);
      Alert.alert("Error", "Failed to update quantity");
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            try {
              const item = cartItems.find((i) => i.id === itemId);
              if (item) {
                removeFromCart(parseInt(item.productId));
              }
            } catch (error) {
              console.error("Remove item error:", error);
              Alert.alert("Error", "Failed to remove item");
            }
          },
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert("Clear Cart", "Are you sure you want to clear your cart?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          clearCart();
        },
      },
    ]);
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      {item.product?.imageUrl && (
        <Image
          source={{ uri: item.product.imageUrl }}
          style={styles.productImage}
        />
      )}
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>
          {item.product?.name || "Product"}
        </Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)} each</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
            disabled={updating === item.id}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.quantity}>
            {updating === item.id ? "..." : item.quantity}
          </Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
            disabled={updating === item.id}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.itemTotal}>
          Total: ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.id)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <Text style={styles.emptySubtext}>
          Add some products to get started!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearButton}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item: CartItem) => item.id}
        style={styles.cartList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total: </Text>
          <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
