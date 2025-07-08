import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { fetchHandler, deleteOptions } from "../../../../utils/fetchingUtils";
import styles from "./DeliveryAddressesScreen.styles";

interface DeliveryAddress {
  id: string;
  nickname: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  instructions?: string;
}

export default function DeliveryAddressesScreen() {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      const [data, error] = await fetchHandler(
        "http://localhost:3001/api/addresses"
      );

      if (error) {
        console.error("Failed to fetch addresses:", error);
        return;
      }

      setAddresses(data || []);
    } catch (error) {
      console.error("Addresses fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDeleteAddress = (address: DeliveryAddress) => {
    Alert.alert(
      "Delete Address",
      `Are you sure you want to delete "${address.nickname}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const [, error] = await fetchHandler(
                `http://localhost:3001/api/addresses/${address.id}`,
                deleteOptions
              );

              if (error) {
                Alert.alert("Error", "Failed to delete address");
                return;
              }

              setAddresses((prev) =>
                prev.filter((addr) => addr.id !== address.id)
              );
            } catch (err) {
              console.error("Delete address error:", err);
              Alert.alert("Error", "An unexpected error occurred");
            }
          },
        },
      ]
    );
  };

  const handleAddAddress = () => {
    Alert.alert("Add Address", "Address management interface coming soon!");
  };

  const renderAddress = ({ item }: { item: DeliveryAddress }) => (
    <View style={[styles.addressItem, item.isDefault && styles.defaultAddress]}>
      <View style={styles.addressHeader}>
        <Text style={styles.addressNickname}>{item.nickname}</Text>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>DEFAULT</Text>
          </View>
        )}
      </View>

      <Text style={styles.fullName}>{item.fullName}</Text>
      <Text style={styles.addressLine}>{item.street}</Text>
      <Text style={styles.addressLine}>
        {item.city}, {item.state} {item.zipCode}
      </Text>
      <Text style={styles.addressLine}>{item.country}</Text>

      {item.instructions && (
        <Text style={styles.instructions}>
          Instructions: {item.instructions}
        </Text>
      )}

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteAddress(item)}
      >
        <Text style={styles.deleteButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading addresses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Addresses</Text>

      {addresses.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No delivery addresses</Text>
          <Text style={styles.emptySubtext}>
            Add a delivery address to make checkout faster.
          </Text>
        </View>
      ) : (
        <FlatList
          data={addresses}
          renderItem={renderAddress}
          keyExtractor={(item: DeliveryAddress) => item.id}
          style={styles.addressesList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
        <Text style={styles.addButtonText}>+ Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
}
