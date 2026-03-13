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
import { resolveImageUrl } from '../../lib/image';
import { formatPrice } from '@bundle-up/utils';
import type { Product } from '@bundle-up/shared-types';

type Props = NativeStackScreenProps<RootStackParamList, 'Products'>;

export function ProductsScreen({ route, navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const category = route.params?.category;

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {};
        params['channel'] = 'b2c';
      if (category) params['category'] = category;

      // Guard against hanging mobile network requests so UI never spins forever.
      const timeoutMs = 10000;
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error('Request timed out. Please check API connectivity.')),
          timeoutMs,
        );
      });

      try {
        const res = await Promise.race([apiClient.getProducts(params), timeoutPromise]);
        if (!mounted) return;

        if (res.success) {
          setProducts(res.data.data);
        } else {
          setError(res.message || 'Failed to load products.');
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load products.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [category]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.replace('Products', { category })}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
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
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate('ProductDetail', { slug: item.slug || String(item.id) })
          }
        >
          <View style={styles.imageContainer}>
            {resolveImageUrl(item.primary_image) ? (
              <Image
                source={{ uri: resolveImageUrl(item.primary_image)! }}
                style={styles.image}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.imagePlaceholder}>🥚</Text>
            )}
          </View>
          <Text style={styles.cardName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.cardPrice}>{formatPrice(item.b2c_unit_price)}</Text>
          <Text style={styles.cardUnit}>per carton</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#dc2626', fontSize: 14, paddingHorizontal: 24, textAlign: 'center' },
  retryButton: {
    marginTop: 12,
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  retryButtonText: { color: '#fff', fontWeight: '600' },
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
