import { fetchHandler, getPostOptions } from "../utils/fetchingUtils";
import { TokenStorage } from "../utils/tokenStorage";
import { LoginCredentials, RegisterData, User } from "../../shared/types";

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const [data, error] = await fetchHandler(
        `/auth/login`,
        getPostOptions(credentials)
      );

      if (error) {
        const msg = error.message?.toLowerCase().includes("credential")
          ? "Email or password is incorrect"
          : error.message || "Login failed";
        return { success: false, error: msg };
      }

      if (data?.user && data?.tokens) {
        // Store tokens securely
        await TokenStorage.storeTokens(
          data.tokens.accessToken,
          data.tokens.refreshToken
        );

        // Store user data
        await TokenStorage.storeUserData(data.user);

        return { success: true, user: data.user };
      }

      return { success: false, error: "Invalid response from server" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  }

  static async register(userData: RegisterData): Promise<AuthResult> {
    try {
      const [data, error] = await fetchHandler(
        `/auth/register`,
        getPostOptions(userData)
      );

      if (error) {
        return {
          success: false,
          error: error.message || "Registration failed",
        };
      }

      if (data?.user && data?.tokens) {
        // Store tokens securely
        await TokenStorage.storeTokens(
          data.tokens.accessToken,
          data.tokens.refreshToken
        );

        // Store user data
        await TokenStorage.storeUserData(data.user);

        return { success: true, user: data.user };
      }

      return { success: false, error: "Invalid response from server" };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await TokenStorage.getRefreshToken();

      if (!refreshToken) {
        return null;
      }

      const [data, error] = await fetchHandler(
        `/auth/refresh`,
        getPostOptions({ refreshToken })
      );

      if (error || !data?.accessToken) {
        // Refresh failed, clear all tokens
        await TokenStorage.clearAll();
        return null;
      }

      // Store new tokens
      await TokenStorage.storeTokens(
        data.accessToken,
        data.refreshToken || refreshToken
      );

      return data.accessToken;
    } catch (error) {
      console.error("Token refresh error:", error);
      await TokenStorage.clearAll();
      return null;
    }
  }

  /**
   * Get stored user data
   */
  static async getStoredUser(): Promise<User | null> {
    try {
      const userData = await TokenStorage.getUserData();
      const hasTokens = await TokenStorage.hasTokens();

      return hasTokens && userData ? userData : null;
    } catch (error) {
      console.error("Get stored user error:", error);
      return null;
    }
  }

  /**
   * Logout user and clear all stored data
   */
  static async logout(): Promise<void> {
    try {
      const accessToken = await TokenStorage.getAccessToken();

      if (accessToken) {
        // Call logout endpoint (optional)
        await fetchHandler(`/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Always clear local storage
      await TokenStorage.clearAll();
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const hasTokens = await TokenStorage.hasTokens();
      const userData = await TokenStorage.getUserData();

      return hasTokens && !!userData;
    } catch (error) {
      console.error("Auth check error:", error);
      return false;
    }
  }
}

// If you need legacy exports, you can re-enable them below:
// export const login = AuthService.login;
// export const signup = AuthService.register;
