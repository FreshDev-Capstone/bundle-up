import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../RootNavigator';
import { apiClient } from '../../lib/apiClient';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { formatPrice } from '@bundle-up/utils';
import type { Product } from '@bundle-up/shared-types';
import { resolveImageUrl } from '../../lib/image';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export function ProductDetailScreen({ route, navigation }: Props) {
  const { slug } = route.params;
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const isBusiness = user?.role === 'business';

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState('1');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.getProduct(slug, { channel: 'b2c' }).then((res) => {
      if (res.success) setProduct(res.data);
      else setError(res.message);
      setLoading(false);
    });
  }, [slug]);

  async function handleAddToCart() {
    if (!product) return;
    if (!user) {
      navigation.navigate('Login');
      return;
    }

    const quantity = Math.max(1, Number(qty) || 1);
    setAdding(true);
    await addItem(product.id, quantity);
    setAdding(false);
    navigation.navigate('Cart');
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error ?? 'Product not found.'}</Text>
      </View>
    );
  }

  const imageUrl = resolveImageUrl(product.primary_image);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageWrap}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        ) : (
          <Text style={styles.emoji}>🥚</Text>
        )}
      </View>

      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>
        {formatPrice(isBusiness ? product.b2b_case_price : product.b2c_unit_price)}
      </Text>
      <Text style={styles.unit}>{isBusiness ? 'per case' : 'per carton'}</Text>

      <View style={styles.qtyRow}>
        <Text style={styles.qtyLabel}>Quantity</Text>
        <TextInput
          style={styles.qtyInput}
          keyboardType="numeric"
          value={qty}
          onChangeText={setQty}
          maxLength={2}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, !product.is_available && styles.buttonDisabled]}
        onPress={handleAddToCart}
        disabled={!product.is_available || adding}
      >
        {adding ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {product.is_available ? 'Add to Cart' : 'Out of Stock'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 16, paddingBottom: 30 },
  imageWrap: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  image: { width: '85%', height: '85%' },
  emoji: { fontSize: 72 },
  name: { fontSize: 24, fontWeight: '700', color: '#111827' },
  description: { fontSize: 14, color: '#6b7280', marginTop: 8 },
  price: { fontSize: 28, fontWeight: '700', color: '#111827', marginTop: 16 },
  unit: { fontSize: 12, color: '#9ca3af' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18, gap: 10 },
  qtyLabel: { fontSize: 14, color: '#374151' },
  qtyInput: {
    width: 60,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    textAlign: 'center',
    color: '#111827',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#9ca3af' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  errorText: { color: '#dc2626', fontSize: 14 },
});
