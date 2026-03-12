import { create } from 'zustand';

export type AuthModalVariant = 'sfi' | 'nfi';
export type AuthModalMode = 'login' | 'register';

interface AuthModalState {
  isOpen: boolean;
  variant: AuthModalVariant;
  mode: AuthModalMode;

  open: (variant: AuthModalVariant, mode?: AuthModalMode) => void;
  close: () => void;
  setMode: (mode: AuthModalMode) => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  variant: 'sfi',
  mode: 'login',

  open: (variant, mode = 'login') => set({ isOpen: true, variant, mode }),
  close: () => set({ isOpen: false }),
  setMode: (mode) => set({ mode }),
}));
