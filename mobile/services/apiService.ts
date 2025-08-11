import {
  API_ENDPOINTS,
  getAuthHeaders,
  ApiResponse,
  PaginatedResponse,
  ApiError,
} from "../config/apiConfig";

// Generic API request function
const apiRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.error || "Request failed", data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Network error", error);
  }
};

// Authenticated API request function
const authenticatedRequest = async <T>(
  url: string,
  token: string,
  options: RequestInit = {}
): Promise<T> => {
  return apiRequest<T>(url, {
    ...options,
    headers: getAuthHeaders(token),
  });
};

// Product API Service
export const productService = {
  // Get all products
  getAllProducts: async (params?: {
    category?: string;
    product_color?: string;
    product_count?: number;
    available?: boolean;
    search?: string;
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${API_ENDPOINTS.PRODUCTS.LIST}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiRequest<PaginatedResponse>(url);
  },

  // Get product by ID
  getProductById: async (id: string | number): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(API_ENDPOINTS.PRODUCTS.GET_BY_ID(id));
  },

  // Get low inventory products
  getLowInventoryProducts: async (): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(API_ENDPOINTS.PRODUCTS.LOW_INVENTORY);
  },
};

// Authentication API Service
export const authService = {
  // Register new user
  register: async (userData: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    companyName?: string;
  }): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  // Logout user
  logout: async (token: string): Promise<ApiResponse> => {
    return authenticatedRequest<ApiResponse>(API_ENDPOINTS.AUTH.LOGOUT, token, {
      method: "POST",
    });
  },

  // Get user profile
  getProfile: async (token: string): Promise<ApiResponse> => {
    return authenticatedRequest<ApiResponse>(API_ENDPOINTS.AUTH.PROFILE, token);
  },

  // Update user profile
  updateProfile: async (
    token: string,
    profileData: {
      firstName: string;
      lastName: string;
      companyName?: string;
    }
  ): Promise<ApiResponse> => {
    return authenticatedRequest<ApiResponse>(
      API_ENDPOINTS.AUTH.PROFILE,
      token,
      {
        method: "PUT",
        body: JSON.stringify(profileData),
      }
    );
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },
};

// User API Service
export const userService = {
  // Get user profile
  getProfile: async (token: string): Promise<ApiResponse> => {
    return authenticatedRequest<ApiResponse>(
      API_ENDPOINTS.USERS.GET_PROFILE,
      token
    );
  },

  // Update user profile
  updateProfile: async (
    token: string,
    profileData: {
      firstName: string;
      lastName: string;
      companyName?: string;
    }
  ): Promise<ApiResponse> => {
    return authenticatedRequest<ApiResponse>(
      API_ENDPOINTS.USERS.UPDATE_PROFILE,
      token,
      {
        method: "PUT",
        body: JSON.stringify(profileData),
      }
    );
  },

  // Change password
  changePassword: async (
    token: string,
    passwordData: {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    }
  ): Promise<ApiResponse> => {
    return authenticatedRequest<ApiResponse>(
      API_ENDPOINTS.USERS.CHANGE_PASSWORD,
      token,
      {
        method: "PUT",
        body: JSON.stringify(passwordData),
      }
    );
  },
};

// Health check service
export const healthService = {
  checkHealth: async (): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(API_ENDPOINTS.HEALTH);
  },
};

// Cart API Service (to be implemented when backend routes are added)
export const cartService = {
  // Placeholder for cart functionality
  getCart: async (token: string): Promise<ApiResponse> => {
    // This will be implemented when cart routes are added to backend
    throw new ApiError(501, "Cart functionality not yet implemented");
  },
};

// Orders API Service
export const orderService = {
  // Get all orders for authenticated user
  getOrders: async (token: string): Promise<ApiResponse> => {
    return authenticatedRequest<ApiResponse>(API_ENDPOINTS.ORDERS.LIST, token);
  },

  // Create a new order
  createOrder: async (
    token: string,
    orderData: {
      items: {
        productId: string;
        quantity: number;
        price: number;
      }[];
      deliveryAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
      paymentMethod: string;
      notes?: string;
    }
  ): Promise<ApiResponse> => {
    return authenticatedRequest<ApiResponse>(
      API_ENDPOINTS.ORDERS.CREATE,
      token,
      {
        method: "POST",
        body: JSON.stringify(orderData),
      }
    );
  },

  // Get order by ID
  getOrderById: async (
    token: string,
    orderId: string
  ): Promise<ApiResponse> => {
    return authenticatedRequest<ApiResponse>(
      API_ENDPOINTS.ORDERS.GET_BY_ID(orderId),
      token
    );
  },

  // Get user's order history
  getOrderHistory: async (token: string): Promise<ApiResponse> => {
    return authenticatedRequest<ApiResponse>(
      `${API_ENDPOINTS.ORDERS.LIST}/history`,
      token
    );
  },
};

export default {
  productService,
  authService,
  userService,
  healthService,
  cartService,
  orderService,
};
