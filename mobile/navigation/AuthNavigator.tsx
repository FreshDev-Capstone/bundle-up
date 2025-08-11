import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/auth/SplashScreen";
import LoginForm from "../screens/auth/LoginForm";
import SignupForm from "../screens/auth/SignupForm";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Login" component={LoginForm} />
      <Stack.Screen name="Signup" component={SignupForm} />
    </Stack.Navigator>
  );
}
