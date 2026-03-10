import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../RootNavigator';
import { apiClient } from '../../lib/apiClient';
import { formatPrice } from '@bundle-up/utils';
import type { Product } from '@bundle-up/shared-types';

type Props = NativeStackScreenProps<RootStackParamList, 'Products'>;

export function ProductsScreen({ route }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const category = route.params?.category;

  useEffect(() => {
    const params: Record<string, string> = {};
    if (category) params['category'] = category;
    apiClient.getProducts(params).then((res) => {
      if (res.success) setProducts(res.data.data);
      setLoading(false);
    });
  }, [category]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card}>
          <View style={styles.imageContainer}>
            {item.primary_image ? (
              <Image
                source={{ uri: item.primary_image }}
                style={styles.image}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.imagePlaceholder}>🥚</Text>
            )}
          </View>
          <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.cardPrice}>{formatPrice(item.b2c_unit_price)}</Text>
          <Text style={styles.cardUnit}>per carton</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 12 },
  row: { gap: 10, marginBottom: 10 },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  imageContainer: {
    aspectRatio: 1,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '80%', height: '80%' },
  imagePlaceholder: { fontSize: 40 },
  cardName: { fontSize: 12, fontWeight: '500', color: '#374151', padding: 8, paddingBottom: 2 },
  cardPrice: { fontSize: 15, fontWeight: '700', color: '#111827', paddingHorizontal: 8 },
  cardUnit: { fontSize: 10, color: '#9ca3af', paddingHorizontal: 8, paddingBottom: 8 },
});
