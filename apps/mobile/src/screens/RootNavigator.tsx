import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/authStore';
import { HomeScreen } from './sfi/HomeScreen';
import { ProductsScreen } from './sfi/ProductsScreen';
import { LoginScreen } from './sfi/LoginScreen';
import { CartScreen } from './sfi/CartScreen';

export type RootStackParamList = {
  Home: undefined;
  Products: { category?: string };
  ProductDetail: { slug: string };
  Cart: undefined;
  Login: undefined;
  Orders: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { user } = useAuthStore();

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: '🥚 Bundle Up' }} />
      <Stack.Screen name="Products" component={ProductsScreen} options={{ title: 'Products' }} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Sign In', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
