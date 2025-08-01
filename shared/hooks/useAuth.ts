import { useState, useEffect } from "react";
import { login, register, getUserProfile } from "../api/endpoints";
import { User, RegisterData } from "../types";

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useAuth = (
  // Platform-specific storage functions
  getStoredToken: () => string | null,
  setStoredToken: (token: string | null) => void,
  getStoredUser: () => User | null,
  setStoredUser: (user: User | null) => void
): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const [data, loginError] = await login(credentials);

      if (loginError) {
        setError(loginError.message || "Login failed");
        return false;
      }

      if (data?.user && data?.token) {
        setUser(data.user);
        setStoredUser(data.user);
        setStoredToken(data.token);
        return true;
      }

      setError("Invalid response from server");
      return false;
    } catch (err) {
      setError("Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData: RegisterData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (
        !userData.email ||
        !userData.password ||
        !userData.firstName ||
        !userData.lastName
      ) {
        setError("All fields are required");
        return false;
      }

      if (userData.password !== userData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }

      const registerData = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        accountType: "B2C" as "B2B" | "B2C", // Default to B2C, can be overridden
      };

      const [data, registerError] = await register(registerData);

      if (registerError) {
        setError(registerError.message || "Registration failed");
        return false;
      }

      if (data?.user && data?.token) {
        setUser(data.user);
        setStoredUser(data.user);
        setStoredToken(data.token);
        return true;
      }

      setError("Invalid response from server");
      return false;
    } catch (err) {
      setError("Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setStoredUser(null);
    setStoredToken(null);
    setError(null);
  };

  const refreshProfile = async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      const [data, profileError] = await getUserProfile();
      if (data && !profileError) {
        setUser(data);
        setStoredUser(data);
      }
    } catch (err) {
      console.error("Failed to refresh profile:", err);
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
      // Optionally refresh profile to ensure it's up to date
      refreshProfile();
    }
  }, []);

  return {
    user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshProfile,
    isAuthenticated: !!user,
  };
};
