import { create } from 'zustand';
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
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  profile: null,
  businessAccount: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
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

  logout: () => {
    apiClient.setToken(null);
    set({ token: null, user: null, profile: null, businessAccount: null });
  },
}));
