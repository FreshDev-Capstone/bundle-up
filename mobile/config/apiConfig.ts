// API Configuration
// must change this to the ip of the machine running the backend
export const API_BASE_URL_LOCAL = "http://localhost:3000";
export const API_BASE_URL_HOME = "http://192.168.1.189:3000";
export const API_BASE_URL_MARCY = "http://10.0.12.83:3000";
export const API_BASE_URL_WORKING = "http://192.168.56.1:3000";
export const API_URL_TEMP = "http://192.168.86.44:3000";

// Use this as the primary base URL - change to match your network
export const API_BASE_URL = API_BASE_URL_LOCAL; // Using your Wi-Fi IP: 10.0.13.161

// API Endpoints
export const API_ENDPOINTS = {
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`,

  // Authentication
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
    REFRESH_TOKEN: `${API_BASE_URL}/api/auth/refresh`,
  },

  // User management
  USERS: {
    REGISTER: `${API_BASE_URL}/api/users`,
    GET_PROFILE: `${API_BASE_URL}/api/users/me`,
    UPDATE_PROFILE: `${API_BASE_URL}/api/users/me`,
    CHANGE_PASSWORD: `${API_BASE_URL}/api/users/me/password`,
  },

  // Sessions
  SESSIONS: {
    LOGIN: `${API_BASE_URL}/api/sessions`,
    LOGOUT: `${API_BASE_URL}/api/sessions`,
    REFRESH: `${API_BASE_URL}/api/sessions/refresh`,
  },

  // Products
  PRODUCTS: {
    LIST: `${API_BASE_URL}/api/products`,
    GET_BY_ID: (id: string | number) => `${API_BASE_URL}/api/products/${id}`,
    CREATE: `${API_BASE_URL}/api/products`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/api/products/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/api/products/${id}`,
    LOW_INVENTORY: `${API_BASE_URL}/api/products/low-inventory`,
    UPDATE_INVENTORY: (id: string | number) =>
      `${API_BASE_URL}/api/products/${id}/inventory`,
    TOGGLE_AVAILABILITY: (id: string | number) =>
      `${API_BASE_URL}/api/products/${id}/toggle-availability`,
  },

  // Cart (to be implemented)
  CART: {
    GET: `${API_BASE_URL}/api/cart`,
    ADD_ITEM: `${API_BASE_URL}/api/cart/items`,
    UPDATE_ITEM: (id: string | number) =>
      `${API_BASE_URL}/api/cart/items/${id}`,
    REMOVE_ITEM: (id: string | number) =>
      `${API_BASE_URL}/api/cart/items/${id}`,
    CLEAR: `${API_BASE_URL}/api/cart/clear`,
  },

  // Orders (to be implemented)
  ORDERS: {
    LIST: `${API_BASE_URL}/api/orders`,
    CREATE: `${API_BASE_URL}/api/orders`,
    GET_BY_ID: (id: string | number) => `${API_BASE_URL}/api/orders/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/api/orders/${id}`,
    CANCEL: (id: string | number) => `${API_BASE_URL}/api/orders/${id}/cancel`,
    REORDER: (id: string | number) =>
      `${API_BASE_URL}/api/orders/${id}/reorder`,
  },

  // Addresses (to be implemented)
  ADDRESSES: {
    LIST: `${API_BASE_URL}/api/addresses`,
    CREATE: `${API_BASE_URL}/api/addresses`,
    GET_BY_ID: (id: string | number) => `${API_BASE_URL}/api/addresses/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/api/addresses/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/api/addresses/${id}`,
    SET_DEFAULT: (id: string | number) =>
      `${API_BASE_URL}/api/addresses/${id}/default`,
  },

  // Payment methods (to be implemented)
  PAYMENTS: {
    LIST: `${API_BASE_URL}/api/payment-methods`,
    CREATE: `${API_BASE_URL}/api/payment-methods`,
    GET_BY_ID: (id: string | number) =>
      `${API_BASE_URL}/api/payment-methods/${id}`,
    UPDATE: (id: string | number) =>
      `${API_BASE_URL}/api/payment-methods/${id}`,
    DELETE: (id: string | number) =>
      `${API_BASE_URL}/api/payment-methods/${id}`,
    SET_DEFAULT: (id: string | number) =>
      `${API_BASE_URL}/api/payment-methods/${id}/default`,
  },
};

// API Headers
export const getAuthHeaders = (token?: string) => ({
  "Content-Type": "application/json",
  ...(token && { Authorization: `Bearer ${token}` }),
});

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Error handling
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}
