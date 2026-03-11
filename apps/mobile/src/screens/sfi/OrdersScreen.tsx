import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../RootNavigator';
import type { Order } from '@bundle-up/shared-types';
import { apiClient } from '../../lib/apiClient';
import { useAuthStore } from '../../stores/authStore';
import { formatPrice } from '@bundle-up/utils';

type Props = NativeStackScreenProps<RootStackParamList, 'Orders'>;

export function OrdersScreen({ navigation }: Props) {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    apiClient.getOrders().then((res) => {
      if (res.success) setOrders(res.data.data);
      setLoading(false);
    });
  }, [navigation, user]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No orders yet.</Text>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Products', {})}
        >
          <Text style={styles.linkButtonText}>Start shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {orders.map((order) => (
        <TouchableOpacity
          key={order.id}
          style={styles.card}
          onPress={() => navigation.navigate('OrderDetail', { id: order.id })}
        >
          <View style={styles.row}>
            <Text style={styles.orderNo}>{order.order_number}</Text>
            <Text style={styles.status}>{order.status}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.date}>{new Date(order.created_at).toLocaleDateString()}</Text>
            <Text style={styles.total}>{formatPrice(Number(order.total))}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 16, gap: 10 },
  emptyText: { color: '#6b7280', fontSize: 16, marginBottom: 10 },
  linkButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  linkButtonText: { color: '#374151', fontWeight: '600' },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 12,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderNo: { fontSize: 13, fontWeight: '700', color: '#111827' },
  status: { textTransform: 'capitalize', fontSize: 12, color: '#2563eb' },
  date: { marginTop: 5, color: '#6b7280', fontSize: 12 },
  total: { marginTop: 5, color: '#111827', fontWeight: '700' },
});
