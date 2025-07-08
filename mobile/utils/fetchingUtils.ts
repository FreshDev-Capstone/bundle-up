// Mobile-specific fetchingUtils with automatic auth handling
import { ApiInterceptor } from "./apiInterceptor";

export const basicFetchOptions = {
  method: "GET",
  credentials: "include" as RequestCredentials,
};

export const deleteOptions = {
  method: "DELETE",
  credentials: "include" as RequestCredentials,
};

export const getPostOptions = (body: any) => ({
  method: "POST",
  credentials: "include" as RequestCredentials,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const getPatchOptions = (body: any) => ({
  method: "PATCH",
  credentials: "include" as RequestCredentials,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

// Enhanced fetchHandler with automatic auth and token refresh
export const fetchHandler = async (url: string, options: any = {}) => {
  try {
    // Add auth header automatically
    const authOptions = await ApiInterceptor.addAuthHeader({
      ...basicFetchOptions,
      ...options,
    });

    const response = await fetch(url, authOptions);

    // Handle response with automatic token refresh
    const finalResponse = await ApiInterceptor.handleResponse(
      response,
      url,
      authOptions
    );

    const { ok, status, headers: resHeaders } = finalResponse;

    if (!ok) {
      let errorMessage = `Request failed with status ${status}`;

      // Try to get error message from response
      try {
        const errorData = await finalResponse.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = finalResponse.statusText || errorMessage;
      }

      // Handle different error status codes
      if (status === 401) {
        throw new Error("Authentication required");
      } else if (status === 403) {
        throw new Error("Access forbidden");
      } else if (status === 404) {
        throw new Error("Resource not found");
      } else if (status >= 500) {
        throw new Error("Server error");
      } else {
        throw new Error(errorMessage);
      }
    }

    const isJson = (resHeaders.get("content-type") || "").includes(
      "application/json"
    );
    const responseData = await (isJson
      ? finalResponse.json()
      : finalResponse.text());
    return [responseData, null];
  } catch (error) {
    console.error("Fetch error:", error);
    return [null, error];
  }
};
