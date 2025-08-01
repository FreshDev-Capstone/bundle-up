import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { create } from "zustand";
import type { AuthState, User } from "../../shared/types";
import { AuthService } from "../services/auth";
import { PerformanceMonitor } from "../utils/performance";

// Enhanced AuthState with loading and error states
interface ExtendedAuthState extends AuthState {
  loading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName?: string; // Optional company name for B2B
  }) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<ExtendedAuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await AuthService.logout();
      set({ user: null, isAuthenticated: false, loading: false });
    } catch (error) {
      console.error("Logout error:", error);
      set({ loading: false, error: "Failed to logout" });
    }
  },

  initialize: async () => {
    set({ loading: true, error: null });
    try {
      PerformanceMonitor.startTimer("auth-initialization");
      const storedUser = await AuthService.getStoredUser();
      if (storedUser) {
        set({ user: storedUser, isAuthenticated: true, loading: false });
      } else {
        set({ user: null, isAuthenticated: false, loading: false });
      }
      PerformanceMonitor.endTimer("auth-initialization");
    } catch (error) {
      console.error("Auth initialization error:", error);
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: "Failed to initialize auth",
      });
      PerformanceMonitor.endTimer("auth-initialization");
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const result = await AuthService.login({ email, password });

      if (result.success && result.user) {
        set({
          user: result.user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
        return true;
      } else {
        set({
          loading: false,
          error: result.error || "Login failed",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      set({ loading: false, error: "Network error. Please try again." });
      return false;
    }
  },

  register: async (userData) => {
    console.log("AuthContext.register called with:", {
      ...userData,
      password: "[HIDDEN]",
    });
    set({ loading: true, error: null });
    try {
      const result = await AuthService.register(userData);
      console.log("AuthContext.register result:", result);

      if (result.success && result.user) {
        console.log("AuthContext.register success, setting user");
        set({
          user: result.user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
        return true;
      } else {
        console.log("AuthContext.register failed, error:", result.error);
        set({
          loading: false,
          error: result.error || "Registration failed",
        });
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace",
        name: error instanceof Error ? error.name : "Unknown error type",
      });

      // Show more specific error message based on the error
      let errorMessage = "Please check your internet connection and try again.";
      if (error instanceof Error) {
        if (error.message.includes("fetch")) {
          errorMessage = "Unable to connect to server. Please try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message.includes("Network request failed")) {
          errorMessage =
            "Network connection failed. Please check your internet connection.";
        } else {
          errorMessage = error.message;
        }
      }
      set({ loading: false, error: errorMessage });
      return false;
    }
  },

  updateProfile: async (updates: Partial<User>) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implement API call to update profile
      // For now, just update the local state
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser: User = { ...currentUser, ...updates };
        set({
          user: updatedUser,
          loading: false,
          error: null,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Profile update error:", error);
      set({ loading: false, error: "Failed to update profile" });
      return false;
    }
  },
  clearError: () => set({ error: null }),
}));

const AuthContext = createContext<ExtendedAuthState | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const store = useAuthStore();
  const initialized = useRef(false);

  // Initialize auth state when app starts - prevent re-initialization
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      store.initialize();
    }
  }, [store]);

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
