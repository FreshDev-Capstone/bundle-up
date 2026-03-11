import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../RootNavigator';
import { useAuthStore } from '../../stores/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const categories = [
  { label: 'Commodity', slug: 'commodity', emoji: '🐔' },
  { label: 'Organic', slug: 'organic', emoji: '🌿' },
  { label: 'Cage Free', slug: 'cage-free', emoji: '🏡' },
  { label: 'Pasture Raised', slug: 'pasture-raised', emoji: '🌾' },
  { label: 'Heirloom', slug: 'heirloom', emoji: '🌈' },
  { label: 'Specialty', slug: 'specialty', emoji: '⭐' },
];

export function HomeScreen({ navigation }: Props) {
  const { user } = useAuthStore();
  const isBusiness = user?.role === 'business';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🥚</Text>
        <Text style={styles.heroTitle}>Fresh Eggs, Delivered.</Text>
        <Text style={styles.heroSubtitle}>
          Shop the finest eggs from Sunshine Farms – commodity to premium heirloom.
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Products', {})}
        >
          <Text style={styles.ctaButtonText}>Shop Now</Text>
        </TouchableOpacity>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.secondaryButtonText}>View Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => (user ? navigation.navigate('Orders') : navigation.navigate('Login'))}
          >
            <Text style={styles.secondaryButtonText}>My Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => (user ? navigation.navigate('Profile') : navigation.navigate('Login'))}
          >
            <Text style={styles.secondaryButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Shop by Category</Text>
      <View style={styles.categoryGrid}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.slug}
            style={styles.categoryCard}
            onPress={() => navigation.navigate('Products', { category: cat.slug })}
          >
            <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
            <Text style={styles.categoryLabel}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isBusiness ? (
        <>
          <Text style={styles.sectionTitle}>Business Tools</Text>
          <View style={styles.categoryGrid}>
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => navigation.navigate('Products', {})}
            >
              <Text style={styles.categoryEmoji}>📦</Text>
              <Text style={styles.categoryLabel}>Case Pricing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => navigation.navigate('Cart')}
            >
              <Text style={styles.categoryEmoji}>🚚</Text>
              <Text style={styles.categoryLabel}>Bulk Ordering</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => navigation.navigate('Orders')}
            >
              <Text style={styles.categoryEmoji}>📋</Text>
              <Text style={styles.categoryLabel}>Invoice Details</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  hero: { alignItems: 'center', paddingVertical: 32 },
  heroEmoji: { fontSize: 64, marginBottom: 12 },
  heroTitle: { fontSize: 28, fontWeight: '700', color: '#111827', textAlign: 'center' },
  heroSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  ctaButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  ctaButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  quickActions: { marginTop: 12, width: '100%', gap: 8 },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#374151', fontWeight: '600', fontSize: 14 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    marginTop: 8,
  },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryCard: {
    width: '47%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  categoryEmoji: { fontSize: 28, marginBottom: 6 },
  categoryLabel: { fontSize: 14, fontWeight: '500', color: '#374151' },
});
