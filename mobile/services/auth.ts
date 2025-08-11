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
        let errorMessage = error.message || "Login failed";

        // Handle specific HTTP status codes
        if (error.message?.includes("401")) {
          errorMessage = "Email or password is incorrect";
        } else if (error.message?.includes("404")) {
          errorMessage =
            "Account not found. Please check your email or sign up.";
        } else if (error.message?.includes("Network request failed")) {
          errorMessage =
            "Network connection failed. Please check your internet connection.";
        }

        return { success: false, error: errorMessage };
      }

      // Handle the backend response structure
      const responseData = data?.data || data;
      const user = responseData?.user;
      const tokens = responseData?.tokens;

      if (user && tokens) {
        // Store tokens securely
        await TokenStorage.storeTokens(tokens.accessToken, tokens.refreshToken);

        // Add token to user object for easy access
        const userWithToken = { ...user, token: tokens.accessToken };

        // Store user data with token
        await TokenStorage.storeUserData(userWithToken);

        return { success: true, user: userWithToken };
      }

      console.log("Invalid response structure:", data);
      return { success: false, error: "Invalid response from server" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  }

  static async register(userData: RegisterData): Promise<AuthResult> {
    try {
      console.log("AuthService.register called with:", {
        ...userData,
        password: "[HIDDEN]",
      });

      const [data, error] = await fetchHandler(
        `/auth/register`,
        getPostOptions(userData)
      );

      console.log("AuthService.register response:", { data, error });

      if (error) {
        console.log("AuthService.register error:", error);
        let errorMessage = error.message || "Registration failed";

        // Handle specific HTTP status codes
        if (error.message?.includes("409")) {
          errorMessage =
            "An account with this email already exists. Please try logging in instead.";
        } else if (error.message?.includes("400")) {
          errorMessage = "Please check your information and try again.";
        } else if (error.message?.includes("Network request failed")) {
          errorMessage =
            "Network connection failed. Please check your internet connection.";
        }

        console.log("AuthService.register returning error:", errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      }

      // Handle the backend response structure
      const responseData = data?.data || data;
      const user = responseData?.user;
      const tokens = responseData?.tokens;

      if (user && tokens) {
        // Store tokens securely
        await TokenStorage.storeTokens(tokens.accessToken, tokens.refreshToken);

        // Add token to user object for easy access
        const userWithToken = { ...user, token: tokens.accessToken };

        // Store user data with token
        await TokenStorage.storeUserData(userWithToken);

        return { success: true, user: userWithToken };
      }

      console.log("Invalid response structure:", data);
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

      if (hasTokens && userData) {
        // Ensure the user has the current token
        const accessToken = await TokenStorage.getAccessToken();
        if (accessToken) {
          return { ...userData, token: accessToken };
        }
        return userData;
      }
      return null;
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
