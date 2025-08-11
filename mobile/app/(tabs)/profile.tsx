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
import { useBrand } from "../../context/BrandContext";
import { AuthFormConfig } from "../../../shared/types";
import { BRANDS } from "../../../shared/config/brands";
import LoginForm from "../../components/auth/LoginForm/LoginForm";
import SignupForm from "../../components/auth/SignupForm/SignupForm";
import { useNavigation } from "@react-navigation/native";

// Lazy load ProfileScreen to reduce initial bundle size
const ProfileScreen = React.lazy(
  () => import("../../screens/dashboard/B2C-B2B/ProfileScreen")
);

export default function ProfileTab() {
  const { isAuthenticated, user } = useAuth();
  const { setBrand } = useBrand();
  const [showLogin, setShowLogin] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isB2B, setIsB2B] = useState(false);

  const navigate = useNavigation<any>();

  // Initialize brand based on toggle
  useEffect(() => {
    if (isB2B) {
      setBrand(BRANDS.NATURAL_FOODS as any);
    } else {
      setBrand(BRANDS.SUNSHINE_FARM as any);
    }
  }, [isB2B, setBrand]);

  // Create auth config based on brand or default to B2C
  const authConfig: AuthFormConfig = {
    brandType: isB2B ? "B2B" : "B2C",
    logo: isB2B
      ? require("../../../shared/assets/images/NFI-Logo.png")
      : require("../../../shared/assets/images/SFI-Logo.png"),
    subtitle: isB2B
      ? "Professional food service solutions for your business needs."
      : "Farm-fresh products delivered with the same love and care we'd give our own family.",
    showCompanyName: isB2B, // Only show company name for B2B signup
  };

  // Handle successful authentication with welcome message
  const handleAuthSuccess = () => {
    navigate.navigate("ProfileScreen");
  };

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
          {/* Business Account Toggle Button */}
          <TouchableOpacity
            style={[
              styles.businessAccountButton,
              isB2B && styles.businessAccountButtonActive,
            ]}
            onPress={() => setIsB2B(!isB2B)}
          >
            <Text
              style={[
                styles.businessAccountText,
                isB2B && styles.businessAccountTextActive,
              ]}
            >
              {isB2B ? "Individual" : "Business"}
            </Text>
            <Text
              style={[
                styles.businessAccountText,
                isB2B && styles.businessAccountTextActive,
              ]}
            >
              Account
            </Text>
          </TouchableOpacity>

          <Image
            source={authConfig.logo}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitleText}>{authConfig.subtitle}</Text>

          {showLogin ? (
            <LoginForm
              keyboardVisible={keyboardVisible}
              config={authConfig}
              onSuccess={handleAuthSuccess}
            />
          ) : (
            <SignupForm
              keyboardVisible={keyboardVisible}
              config={authConfig}
              onSuccess={handleAuthSuccess}
            />
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
    position: "relative", // Enable absolute positioning for business button
  },

  // Business Account button in top right corner
  businessAccountButton: {
    position: "absolute",
    top: 40,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 10,
    alignItems: "center", // Center the text vertically
    justifyContent: "center", // Center the text horizontally
    minWidth: 80, // Minimum width to ensure button isn't too small
  },

  // Active state for business account button
  businessAccountButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },

  // Business account button text
  businessAccountText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    lineHeight: 14, // Tighter line height for 2-line text
  },

  // Active state for business account button text
  businessAccountTextActive: {
    color: "#fff",
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
    fontStyle: "italic", // Italic style for emphasis
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
