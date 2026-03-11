import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../RootNavigator';
import type { OrderWithItems } from '@bundle-up/shared-types';
import { apiClient } from '../../lib/apiClient';
import { formatPrice } from '@bundle-up/utils';
import { resolveImageUrl } from '../../lib/image';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

export function OrderDetailScreen({ route, navigation }: Props) {
  const { id, confirmed } = route.params;
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getOrder(id).then((res) => {
      if (res.success) setOrder(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Order not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {confirmed ? (
        <Text style={styles.confirmed}>Order confirmed. Thank you for your purchase.</Text>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.orderTitle}>Order {order.order_number}</Text>
        <Text style={styles.meta}>Placed on {new Date(order.created_at).toLocaleString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        {order.items.map((item) => {
          const imageUrl = resolveImageUrl(item.product.primary_image);
          return (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
                ) : (
                  <View style={styles.imageFallback}>
                    <Text>🥚</Text>
                  </View>
                )}
                <View>
                  <Text style={styles.itemName}>{item.product.name}</Text>
                  <Text style={styles.itemQty}>Qty {item.quantity}</Text>
                </View>
              </View>
              <Text style={styles.itemPrice}>{formatPrice(Number(item.line_total))}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Totals</Text>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text>{formatPrice(Number(order.subtotal))}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax</Text>
          <Text>{formatPrice(Number(order.tax))}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Shipping</Text>
          <Text>{formatPrice(Number(order.shipping))}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.grandLabel}>Total</Text>
          <Text style={styles.grandLabel}>{formatPrice(Number(order.total))}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('Orders')}>
          <Text style={styles.linkText}>Back to Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => navigation.navigate('Products', {})}
        >
          <Text style={styles.linkText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 16, paddingBottom: 26, gap: 12 },
  confirmed: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderWidth: 1,
    color: '#15803d',
    borderRadius: 8,
    padding: 10,
  },
  section: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 12,
  },
  orderTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  meta: { marginTop: 4, color: '#6b7280', fontSize: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 8 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  image: { width: 42, height: 42, backgroundColor: '#f9fafb', borderRadius: 6 },
  imageFallback: {
    width: 42,
    height: 42,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: { fontSize: 13, fontWeight: '600', color: '#111827' },
  itemQty: { fontSize: 12, color: '#6b7280' },
  itemPrice: { fontWeight: '700', color: '#111827' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  totalLabel: { color: '#6b7280' },
  grandLabel: { fontWeight: '700', color: '#111827' },
  actions: { flexDirection: 'row', gap: 10 },
  linkBtn: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  linkText: { color: '#374151', fontWeight: '600' },
  emptyText: { color: '#6b7280' },
});
