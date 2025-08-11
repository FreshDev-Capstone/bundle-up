import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";
import AuthLoadingScreen from "../components/auth/AuthLoadingScreen";
import { useAuthStore } from "../context/AuthContext";

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
