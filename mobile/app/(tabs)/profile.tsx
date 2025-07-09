import React, { useState, Suspense, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import SignupForm from "../../components/auth/SignupForm/SignupForm";
import LoginForm from "../../components/auth/LoginForm/LoginForm";

// Lazy load ProfileScreen to reduce initial bundle size
const ProfileScreen = React.lazy(
  () => import("../../screens/profile/ProfileScreen")
);

export default function ProfileTab() {
  const { isAuthenticated, user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // If user is authenticated, show the actual profile screen
  if (isAuthenticated && user) {
    return (
      <Suspense
        fallback={
          <View style={[styles.container, styles.centered]}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        }
      >
        <ProfileScreen />
      </Suspense>
    );
  }

  // If user is not authenticated, show auth forms
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Removed offset since we're hiding header
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.authContainer}>
          <Image
            source={require("../../../shared/assets/images/SFI-Logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitleText}>
            Farm-fresh products delivered with the same love and care we&apos;d
            give our own family.
          </Text>

          {showLogin ? (
            <LoginForm keyboardVisible={keyboardVisible} />
          ) : (
            <SignupForm keyboardVisible={keyboardVisible} />
          )}

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {showLogin
                ? "Don't have an account? "
                : "Already have an account? "}
            </Text>
            <TouchableOpacity onPress={() => setShowLogin(!showLogin)}>
              <Text style={styles.switchLink}>
                {showLogin ? "Sign Up" : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Main container for the entire profile tab
  container: {
    flex: 1, // Takes full screen height
    backgroundColor: "#f5f5f5", // Light gray background
  },

  // Container that holds logo, subtitle, form, and switch text
  authContainer: {
    flex: 1, // Takes full height of container
    justifyContent: "center", // Centers all content vertically on screen
    paddingHorizontal: 20, // Clean horizontal padding for breathing room
  },

  // SFI Logo image styling
  logo: {
    width: 260, // Bigger logo width (increased from 200)
    height: 104, // Bigger logo height (increased from 80, maintaining aspect ratio)
    alignSelf: "center", // Centers logo horizontally
    marginTop: 45, // Increased top margin for more padding above logo
    marginBottom: 12, // Slightly reduced bottom margin to maintain spacing
  },

  // Subtitle text: "Farm-fresh products delivered..."
  subtitleText: {
    fontSize: 14, // Smaller text size for subtitle
    textAlign: "center", // Centers text horizontally
    marginBottom: 14, // Slightly reduced space below subtitle to compensate for bigger logo
    color: "#666", // Medium gray text color
    lineHeight: 20, // Adjusted line height for smaller font
    paddingHorizontal: 18, // Added horizontal padding for more breathing room
  },

  // Container for "Already have an account?" / "Don't have an account?" section
  switchContainer: {
    flexDirection: "row", // Horizontal layout for text + link
    justifyContent: "center", // Centers the text horizontally
    alignItems: "center", // Centers items vertically within container
    marginTop: 20, // Clean space above the switch text
    paddingBottom: 20, // Padding below "Already have an account" section
  },

  // Style for "Already have an account?" text
  switchText: {
    fontSize: 16, // Text size for switch prompt
    color: "#666", // Medium gray color
  },

  // Style for "Sign In" / "Sign Up" clickable link
  switchLink: {
    fontSize: 16, // Same size as switch text
    color: "#3498db", // Blue color for clickable link
    fontWeight: "600", // Slightly bold for emphasis
  },

  // Style for loading indicator (when ProfileScreen is loading)
  centered: {
    justifyContent: "center", // Centers loading spinner vertically
    alignItems: "center", // Centers loading spinner horizontally
  },
});
