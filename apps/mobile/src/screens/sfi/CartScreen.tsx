import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../RootNavigator';
import { useCartStore, useCartItemCount } from '../../stores/cartStore';
import { formatPrice } from '@bundle-up/utils';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export function CartScreen({ navigation }: Props) {
  const { cart, updateItem, removeItem } = useCartStore();
  const itemCount = useCartItemCount(cart);

  if (!cart || itemCount === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('Products', {})}
        >
          <Text style={styles.shopButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.unit_price) * item.quantity,
    0,
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {cart.items.map((item) => (
        <View key={item.id} style={styles.item}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={2}>
              {(item as typeof item & { name?: string }).name}
            </Text>
            <Text style={styles.itemPrice}>{formatPrice(item.unit_price)}</Text>
          </View>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              onPress={() => updateItem(item.id, item.quantity - 1)}
              style={styles.qtyBtn}
            >
              <Text style={styles.qtyBtnText}>–</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => updateItem(item.id, item.quantity + 1)}
              style={styles.qtyBtn}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Text style={styles.remove}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Subtotal</Text>
        <Text style={styles.summaryAmount}>{formatPrice(subtotal)}</Text>
      </View>

      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutButtonText}>Checkout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#374151' },
  shopButton: { backgroundColor: '#16a34a', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  shopButtonText: { color: '#fff', fontWeight: '600' },
  item: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  itemInfo: { marginBottom: 8 },
  itemName: { fontSize: 13, fontWeight: '500', color: '#374151' },
  itemPrice: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 16, color: '#374151' },
  qty: { fontSize: 14, fontWeight: '600', minWidth: 24, textAlign: 'center' },
  remove: { fontSize: 14, color: '#9ca3af', marginLeft: 8 },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 8,
  },
  summaryText: { fontSize: 15, color: '#374151' },
  summaryAmount: { fontSize: 15, fontWeight: '700', color: '#111827' },
  checkoutButton: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  checkoutButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
