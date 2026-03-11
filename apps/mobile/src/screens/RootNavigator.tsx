import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/authStore';
import { HomeScreen } from './sfi/HomeScreen';
import { ProductsScreen } from './sfi/ProductsScreen';
import { LoginScreen } from './sfi/LoginScreen';
import { CartScreen } from './sfi/CartScreen';
import { ProductDetailScreen } from './sfi/ProductDetailScreen';
import { CheckoutScreen } from './sfi/CheckoutScreen';
import { OrdersScreen } from './sfi/OrdersScreen';
import { OrderDetailScreen } from './sfi/OrderDetailScreen';
import { ProfileScreen } from './sfi/ProfileScreen';

export type RootStackParamList = {
  Home: undefined;
  Products: { category?: string };
  ProductDetail: { slug: string };
  Cart: undefined;
  Checkout: undefined;
  Login: undefined;
  Orders: undefined;
  OrderDetail: { id: number; confirmed?: boolean };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  useAuthStore();

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: '🥚 Bundle Up' }} />
      <Stack.Screen name="Products" component={ProductsScreen} options={{ title: 'Products' }} />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product Details' }}
      />
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
      <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'My Orders' }} />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: 'Order Details' }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Sign In', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
