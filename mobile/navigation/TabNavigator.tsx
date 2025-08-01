import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileNavigator from "./ProfileNavigator";
// Import other main screens as needed

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={ProfileNavigator} />
      {/* Add other tabs: Home, Products, Cart, Orders, etc. */}
    </Tab.Navigator>
  );
}
