import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_DATA_KEY = "user_data";

// Check if we're running on web
const isWeb = Platform.OS === "web";

/**
 * Secure token storage utility
 * Uses SecureStore for native platforms and localStorage for web
 * Uses AsyncStorage for user data on all platforms
 */
export class TokenStorage {
  /**
   * Store authentication tokens securely
   */
  static async storeTokens(
    accessToken: string,
    refreshToken: string
  ): Promise<void> {
    try {
      if (isWeb) {
        // Use localStorage on web
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      } else {
        // Use SecureStore on native
        await Promise.all([
          SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
          SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
        ]);
      }
    } catch (error) {
      console.error("Failed to store tokens:", error);
      throw error;
    }
  }

  /**
   * Get stored access token
   */
  static async getAccessToken(): Promise<string | null> {
    try {
      if (isWeb) {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
      } else {
        return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      }
    } catch (error) {
      console.error("Failed to get access token:", error);
      return null;
    }
  }

  /**
   * Get stored refresh token
   */
  static async getRefreshToken(): Promise<string | null> {
    try {
      if (isWeb) {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
      } else {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      }
    } catch (error) {
      console.error("Failed to get refresh token:", error);
      return null;
    }
  }

  /**
   * Store user data (non-sensitive)
   */
  static async storeUserData(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to store user data:", error);
      throw error;
    }
  }

  /**
   * Get stored user data
   */
  static async getUserData(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Failed to get user data:", error);
      return null;
    }
  }

  /**
   * Clear all authentication data
   */
  static async clearAll(): Promise<void> {
    try {
      if (isWeb) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        await AsyncStorage.removeItem(USER_DATA_KEY);
      } else {
        await Promise.all([
          SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
          SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
          AsyncStorage.removeItem(USER_DATA_KEY),
        ]);
      }
    } catch (error) {
      console.error("Failed to clear auth data:", error);
      throw error;
    }
  }

  /**
   * Check if tokens exist
   */
  static async hasTokens(): Promise<boolean> {
    try {
      if (isWeb) {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        return !!accessToken;
      } else {
        const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        return !!accessToken;
      }
    } catch (error) {
      console.error("Failed to check tokens:", error);
      return false;
    }
  }
}
