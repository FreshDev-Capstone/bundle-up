import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import styles from "./DeliveryAddressesScreen.styles";
import {
  createAddress,
  deleteAddress,
  getAllAddresses,
} from "../../../../shared/api/endpoints";
import { Address } from "../../../../shared/types";

export default function DeliveryAddressesScreen() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      const [data, error] = await getAllAddresses();

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

  const handleDeleteAddress = (address: Address) => {
    Alert.alert(
      "Delete Address",
      `Are you sure you want to delete this address?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const [, error] = await deleteAddress(`${address.id}`);

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

  const handleAddAddress = async (data: Address) => {
    const [address, error] = await createAddress({
      fullName: data.fullName,
      street: data.street,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      isDefault: data.isDefault,
      instructions: data.instructions,
    });
  };

  const renderAddress = ({ item }: { item: Address }) => (
    <View style={[styles.addressItem, item.isDefault && styles.defaultAddress]}>
      <View style={styles.addressHeader}>
        <Text style={styles.addressName}>{item.fullName}</Text>
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
          keyExtractor={(item: Address) => item.id}
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
