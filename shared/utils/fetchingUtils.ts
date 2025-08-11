// Shared fetchingUtils - platform agnostic
export const basicFetchOptions = {
  method: "GET",
  credentials: "include" as RequestCredentials,
};

export const deleteOptions = {
  method: "DELETE",
  credentials: "include" as RequestCredentials,
};

export const getPostOptions = (body: Record<string, any>) => ({
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

// Generic fetchHandler that can accept token from platform-specific auth
export const fetchHandler = async (
  url: string,
  options: any = {},
  token?: string
) => {
  try {
    const headers = {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const mergedOptions = { ...basicFetchOptions, ...options, headers };
    const response = await fetch(url, mergedOptions);
    const { ok, status, headers: resHeaders } = response;

    if (!ok) {
      // Handle different error status codes
      if (status === 401) {
        // Token expired or invalid - let the calling platform handle logout
        throw new Error("Authentication required");
      } else if (status === 403) {
        throw new Error("Access forbidden");
      } else if (status === 404) {
        throw new Error("Resource not found");
      } else if (status >= 500) {
        throw new Error("Server error");
      } else {
        throw new Error(`Request failed with status ${status}`);
      }
    }

    const isJson = (resHeaders.get("content-type") || "").includes(
      "application/json"
    );
    const responseData = await (isJson ? response.json() : response.text());
    return [responseData, null];
  } catch (error) {
    console.error("Fetch error:", error);
    return [null, error];
  }
};
