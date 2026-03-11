import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../RootNavigator';
import type { Address } from '@bundle-up/shared-types';
import { useAuthStore } from '../../stores/authStore';
import { useCartItemCount, useCartStore } from '../../stores/cartStore';
import { apiClient } from '../../lib/apiClient';
import { formatPrice } from '@bundle-up/utils';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

const emptyAddress = {
  label: '',
  street_line1: '',
  street_line2: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
  is_default: false,
};

export function CheckoutScreen({ navigation }: Props) {
  const { user } = useAuthStore();
  const { cart, fetchCart, clearCart } = useCartStore();
  const itemCount = useCartItemCount(cart);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [loading, setLoading] = useState(true);
  const [savingAddress, setSavingAddress] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }

    async function load() {
      setLoading(true);
      await fetchCart();
      const res = await apiClient.getAddresses();
      if (res.success) {
        setAddresses(res.data);
        const preferred = res.data.find((a) => a.is_default) ?? res.data[0] ?? null;
        setSelectedAddressId(preferred?.id ?? null);
      }
      setLoading(false);
    }

    load();
  }, [fetchCart, navigation, user]);

  const subtotal = useMemo(
    () => cart?.items.reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0) ?? 0,
    [cart],
  );
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  async function handleAddAddress() {
    if (!newAddress.street_line1 || !newAddress.city || !newAddress.state || !newAddress.zip) {
      setError('Street, city, state, and ZIP are required.');
      return;
    }

    setSavingAddress(true);
    setError(null);

    const res = await apiClient.createAddress({
      label: newAddress.label || null,
      street_line1: newAddress.street_line1,
      street_line2: newAddress.street_line2 || null,
      city: newAddress.city,
      state: newAddress.state,
      zip: newAddress.zip,
      country: newAddress.country,
      is_default: newAddress.is_default,
    });

    if (!res.success) {
      setError(res.message);
      setSavingAddress(false);
      return;
    }

    const refresh = await apiClient.getAddresses();
    if (refresh.success) setAddresses(refresh.data);
    setSelectedAddressId(res.data.id);
    setNewAddress(emptyAddress);
    setSavingAddress(false);
  }

  async function handlePlaceOrder() {
    if (!selectedAddressId) {
      setError('Please select or add a delivery address.');
      return;
    }

    setPlacingOrder(true);
    setError(null);

    const res = await apiClient.createOrder(selectedAddressId, selectedAddressId);
    if (!res.success) {
      setError(res.message);
      setPlacingOrder(false);
      return;
    }

    navigation.replace('OrderDetail', { id: res.data.id, confirmed: true });
    clearCart();
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!cart || itemCount === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Products', {})}>
          <Text style={styles.buttonText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.sectionTitle}>Delivery Address</Text>
      {addresses.length === 0 ? (
        <Text style={styles.emptyNote}>No saved address yet. Add one below.</Text>
      ) : (
        addresses.map((address) => (
          <TouchableOpacity
            key={address.id}
            style={[
              styles.addressCard,
              selectedAddressId === address.id ? styles.addressCardSelected : null,
            ]}
            onPress={() => setSelectedAddressId(address.id)}
          >
            <Text style={styles.addressLabel}>{address.label || 'Address'}</Text>
            <Text style={styles.addressText}>{address.street_line1}</Text>
            {address.street_line2 ? (
              <Text style={styles.addressText}>{address.street_line2}</Text>
            ) : null}
            <Text style={styles.addressText}>
              {address.city}, {address.state} {address.zip}
            </Text>
          </TouchableOpacity>
        ))
      )}

      <Text style={styles.sectionTitle}>Add New Address</Text>
      <Text style={styles.helperText}>
        Label helps identify the address later (for example: Home, Office, Storefront).
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Label (Home, Office, etc.)"
        autoComplete="off"
        value={newAddress.label}
        onChangeText={(value) => setNewAddress((prev) => ({ ...prev, label: value }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Street Line 1"
        autoComplete="street-address"
        value={newAddress.street_line1}
        onChangeText={(value) => setNewAddress((prev) => ({ ...prev, street_line1: value }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Street Line 2"
        autoComplete="street-address"
        value={newAddress.street_line2}
        onChangeText={(value) => setNewAddress((prev) => ({ ...prev, street_line2: value }))}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        autoComplete="off"
        value={newAddress.city}
        onChangeText={(value) => setNewAddress((prev) => ({ ...prev, city: value }))}
      />
      <TextInput
        style={styles.input}
        placeholder="State"
        autoComplete="off"
        value={newAddress.state}
        onChangeText={(value) => setNewAddress((prev) => ({ ...prev, state: value }))}
      />
      <TextInput
        style={styles.input}
        placeholder="ZIP"
        autoComplete="postal-code"
        value={newAddress.zip}
        onChangeText={(value) => setNewAddress((prev) => ({ ...prev, zip: value }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Country"
        autoComplete="off"
        value={newAddress.country}
        onChangeText={(value) => setNewAddress((prev) => ({ ...prev, country: value }))}
      />

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={handleAddAddress}
        disabled={savingAddress}
      >
        {savingAddress ? (
          <ActivityIndicator color="#111827" />
        ) : (
          <Text style={styles.secondaryButtonText}>Save Address</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Order Summary</Text>
      {cart.items.map((item) => (
        <View key={item.id} style={styles.summaryRow}>
          <Text style={styles.summaryName}>
            {(item as typeof item & { name?: string }).name} x {item.quantity}
          </Text>
          <Text style={styles.summaryPrice}>
            {formatPrice(Number(item.unit_price) * item.quantity)}
          </Text>
        </View>
      ))}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Subtotal</Text>
        <Text style={styles.totalValue}>{formatPrice(subtotal)}</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Tax</Text>
        <Text style={styles.totalValue}>{formatPrice(tax)}</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.grandLabel}>Total</Text>
        <Text style={styles.grandValue}>{formatPrice(total)}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePlaceOrder} disabled={placingOrder}>
        {placingOrder ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Place Order</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  container: { padding: 16, paddingBottom: 30 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 14 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  error: { backgroundColor: '#fef2f2', color: '#dc2626', padding: 10, borderRadius: 8 },
  emptyTitle: { fontSize: 20, color: '#374151', marginBottom: 12 },
  emptyNote: { color: '#6b7280', marginBottom: 6 },
  helperText: { color: '#6b7280', fontSize: 12, marginBottom: 8 },
  addressCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  addressCardSelected: { borderColor: '#16a34a' },
  addressLabel: { fontWeight: '700', color: '#111827' },
  addressText: { color: '#4b5563', fontSize: 13 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    color: '#111827',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 2,
  },
  secondaryButtonText: { color: '#374151', fontWeight: '600' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, gap: 12 },
  summaryName: { color: '#4b5563', fontSize: 13, flex: 1 },
  summaryPrice: { color: '#111827', fontWeight: '600' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  totalLabel: { color: '#6b7280' },
  totalValue: { color: '#374151', fontWeight: '600' },
  grandLabel: { color: '#111827', fontWeight: '700' },
  grandValue: { color: '#111827', fontWeight: '700' },
});
