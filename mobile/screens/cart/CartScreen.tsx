import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { CartItem } from "../../../shared/types";
import { orderService } from "../../services/apiService";
import { useRouter } from "expo-router";
import styles from "./CartScreen.styles";
import { ShoppingCart } from "lucide-react-native";

export default function CartScreen() {
  const [updating, setUpdating] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const {
    items: cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    setUpdating(itemId);
    try {
      const item = cartItems.find((i) => i.id === itemId);
      if (item) {
        updateQuantity(item.productId, newQuantity);
      }
    } catch (error) {
      console.error("Update quantity error:", error);
      Alert.alert(
        "Inventory Limit",
        error instanceof Error ? error.message : "Failed to update quantity"
      );
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
                removeFromCart(item.productId);
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

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      // Directly navigate to profile tab for authentication
      router.push("/(tabs)/profile");
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert(
        "Empty Cart",
        "Please add items to your cart before checkout."
      );
      return;
    }

    setCheckoutLoading(true);

    try {
      // Prepare order data for API
      const orderItems = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      // Create order via API
      if (!user?.token) {
        throw new Error("User token not available");
      }

      const orderData = await orderService.createOrder(user.token, {
        items: orderItems,
        deliveryAddress: {
          street: "Default Street", // This would come from user's saved address
          city: "Default City",
          state: "Default State",
          zipCode: "12345",
          country: "USA",
        },
        paymentMethod: "default", // This would come from user's saved payment method
        notes: "Order placed from mobile app",
      });

      // Clear the cart after successful order creation
      clearCart();

      // Navigate to reorder page with the cart items
      router.push("/(tabs)/reorder");

      Alert.alert(
        "Order Placed Successfully!",
        `Your order has been created and is now processing. You can view your order history in your profile.`,
        [
          {
            text: "View Orders",
            onPress: () => {
              router.push("/(tabs)/profile");
            },
          },
          {
            text: "Continue Shopping",
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      console.error("Checkout error:", error);
      Alert.alert(
        "Checkout Failed",
        error instanceof Error
          ? error.message
          : "Failed to process your order. Please try again.",
        [
          {
            text: "OK",
            style: "cancel",
          },
        ]
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getAvailableInventory = (item: CartItem) => {
    if (!item.product) return 0;
    return (
      item.product.inventory_by_carton || item.product.inventory_by_box || 0
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const availableInventory = getAvailableInventory(item);
    const isAtMaxQuantity = item.quantity >= availableInventory;

    return (
      <View style={styles.cartItem}>
        <Image
          source={{
            uri: item.product?.image_url || "https://via.placeholder.com/60x60",
          }}
          style={styles.productImage}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.product?.name || "Product"}
          </Text>
          <Text style={styles.productPrice}>${item.price.toFixed(2)} each</Text>

          {/* Inventory Warning */}
          {isAtMaxQuantity && (
            <View style={styles.inventoryWarning}>
              <Text style={styles.inventoryWarningText}>
                ⚠️ Only {availableInventory} available
              </Text>
            </View>
          )}

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
              disabled={updating === item.id}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>

            <View style={styles.quantityInputContainer}>
              <TextInput
                style={[
                  styles.quantityInput,
                  isAtMaxQuantity && styles.quantityInputMax,
                ]}
                value={updating === item.id ? "..." : item.quantity.toString()}
                onChangeText={(text: string) => {
                  // Only allow numbers
                  const numericText = text.replace(/[^0-9]/g, "");
                  const newQuantity = parseInt(numericText) || 0;

                  // Validate against inventory and minimum quantity
                  if (newQuantity >= 0 && newQuantity <= availableInventory) {
                    handleUpdateQuantity(item.id, newQuantity);
                  }
                }}
                onBlur={() => {
                  // Ensure quantity is at least 1 when user finishes editing
                  if (item.quantity === 0) {
                    handleUpdateQuantity(item.id, 1);
                  }
                }}
                keyboardType="numeric"
                placeholder={
                  isAtMaxQuantity ? availableInventory.toString() : "0"
                }
                placeholderTextColor={isAtMaxQuantity ? "#FF6B6B" : "#999"}
                editable={updating !== item.id}
                maxLength={3}
                selectTextOnFocus={true}
              />
              {availableInventory > 0 && (
                <Text style={styles.quantityHint}>
                  Max: {availableInventory}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.quantityButton,
                isAtMaxQuantity && styles.quantityButtonDisabled,
              ]}
              onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
              disabled={updating === item.id || isAtMaxQuantity}
            >
              <Text
                style={[
                  styles.quantityButtonText,
                  isAtMaxQuantity && styles.quantityButtonTextDisabled,
                ]}
              >
                +
              </Text>
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
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ShoppingCart size={64} color="#E5E5E5" style={styles.emptyIcon} />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <Text style={styles.emptySubtext}>
          Add some products to get started!
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={styles.footer}>
        {!isAuthenticated && (
          <View style={styles.authPrompt}>
            <Text style={styles.authPromptText}>
              Sign in to save your cart and complete your purchase
            </Text>
          </View>
        )}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total: </Text>
          <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.checkoutButton,
            !isAuthenticated && styles.checkoutButtonSecondary,
            checkoutLoading && styles.checkoutButtonLoading,
          ]}
          onPress={handleCheckout}
          disabled={checkoutLoading}
        >
          <Text
            style={[
              styles.checkoutButtonText,
              !isAuthenticated && styles.checkoutButtonTextSecondary,
              checkoutLoading && styles.checkoutButtonTextLoading,
            ]}
          >
            {checkoutLoading
              ? "Processing..."
              : isAuthenticated
              ? "Proceed to Checkout"
              : "Sign In to Checkout"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
