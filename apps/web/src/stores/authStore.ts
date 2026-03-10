import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserProfile, BusinessAccount } from '@bundle-up/shared-types';
import { apiClient } from '../lib/apiClient';

interface AuthState {
  token: string | null;
  user: User | null;
  profile: UserProfile | null;
  businessAccount: BusinessAccount | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  registerCustomer: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }) => Promise<void>;
  registerBusiness: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    company_name: string;
    tax_id?: string;
    billing_email?: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist<AuthState, [], [], Pick<AuthState, 'token'>>(
    (set) => ({
      token: null,
      user: null,
      profile: null,
      businessAccount: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        const res = await apiClient.login({ email, password });
        if (res.success) {
          apiClient.setToken(res.data.token);
          set({
            token: res.data.token,
            user: res.data.user,
            profile: res.data.profile,
            businessAccount: res.data.business_account ?? null,
            isLoading: false,
          });
        } else {
          set({ error: res.message, isLoading: false });
        }
      },

      registerCustomer: async (data: {
        email: string;
        password: string;
        first_name: string;
        last_name: string;
        phone?: string;
      }) => {
        set({ isLoading: true, error: null });
        const res = await apiClient.registerCustomer(data);
        if (res.success) {
          apiClient.setToken(res.data.token);
          set({
            token: res.data.token,
            user: res.data.user,
            profile: res.data.profile,
            isLoading: false,
          });
        } else {
          set({ error: res.message, isLoading: false });
        }
      },

      registerBusiness: async (data: {
        email: string;
        password: string;
        first_name: string;
        last_name: string;
        phone?: string;
        company_name: string;
        tax_id?: string;
        billing_email?: string;
      }) => {
        set({ isLoading: true, error: null });
        const res = await apiClient.registerBusiness(data);
        if (res.success) {
          apiClient.setToken(res.data.token);
          set({
            token: res.data.token,
            user: res.data.user,
            profile: res.data.profile,
            businessAccount: res.data.business_account ?? null,
            isLoading: false,
          });
        } else {
          set({ error: res.message, isLoading: false });
        }
      },

      logout: () => {
        apiClient.setToken(null);
        set({ token: null, user: null, profile: null, businessAccount: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'bundle-up-auth',
    },
  ),
);
