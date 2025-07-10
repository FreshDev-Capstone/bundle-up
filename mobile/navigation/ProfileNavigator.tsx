import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/dashboard/B2C-B2B/profile/ProfileScreen";
import EditProfileScreen from "../screens/dashboard/B2C-B2B/profile/EditProfileScreen";
import OrderHistoryScreen from "../screens/dashboard/B2C-B2B/profile/OrderHistoryScreen";
import PaymentMethodsScreen from "../screens/dashboard/B2C-B2B/profile/PaymentMethodsScreen";
import DeliveryAddressesScreen from "../screens/dashboard/B2C-B2B/DeliveryAddressesScreen";
import SettingsScreen from "../screens/dashboard/B2C-B2B/profile/SettingsScreen";

const Stack = createNativeStackNavigator();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: "Edit Profile" }}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{ title: "Order History" }}
      />
      <Stack.Screen
        name="PaymentMethods"
        component={PaymentMethodsScreen}
        options={{ title: "Payment Methods" }}
      />
      <Stack.Screen
        name="DeliveryAddresses"
        component={DeliveryAddressesScreen}
        options={{ title: "Delivery Addresses" }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
    </Stack.Navigator>
  );
}
