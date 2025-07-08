import { TokenStorage } from "./tokenStorage";

/**
 * API interceptor that automatically adds auth headers and handles token refresh
 */
export class ApiInterceptor {
  private static refreshPromise: Promise<string | null> | null = null;

  /**
   * Add authorization header to fetch options
   */
  static async addAuthHeader(options: RequestInit = {}): Promise<RequestInit> {
    const token = await TokenStorage.getAccessToken();

    if (token) {
      return {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      };
    }

    return options;
  }

  /**
   * Handle API responses and automatically refresh tokens if needed
   */
  static async handleResponse(
    response: Response,
    originalUrl: string,
    originalOptions: RequestInit
  ): Promise<Response> {
    // If request is successful or it's not an auth issue, return as is
    if (response.ok || response.status !== 401) {
      return response;
    }

    // Don't attempt refresh for login/register endpoints
    if (
      originalUrl.includes("/auth/login") ||
      originalUrl.includes("/auth/register")
    ) {
      return response;
    }

    // Attempt to refresh token
    const newToken = await this.refreshToken();

    if (newToken) {
      // Retry the original request with new token
      const retryOptions = {
        ...originalOptions,
        headers: {
          ...originalOptions.headers,
          Authorization: `Bearer ${newToken}`,
        },
      };

      return fetch(originalUrl, retryOptions);
    }

    // If refresh failed, return the original 401 response
    return response;
  }

  /**
   * Refresh token with singleton pattern to prevent multiple simultaneous refreshes
   */
  private static async refreshToken(): Promise<string | null> {
    // If a refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start new refresh
    this.refreshPromise = this.doRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      // Clear the promise when done
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual token refresh
   */
  private static async doRefresh(): Promise<string | null> {
    try {
      const refreshToken = await TokenStorage.getRefreshToken();

      if (!refreshToken) {
        return null;
      }

      const response = await fetch(
        `${
          process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001"
        }/api/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!response.ok) {
        // Refresh failed, clear tokens
        await TokenStorage.clearAll();
        return null;
      }

      const data = await response.json();

      if (data.accessToken) {
        // Store new tokens
        await TokenStorage.storeTokens(
          data.accessToken,
          data.refreshToken || refreshToken
        );

        return data.accessToken;
      }

      return null;
    } catch (error) {
      console.error("Token refresh error:", error);
      await TokenStorage.clearAll();
      return null;
    }
  }
}
