// UI and Navigation related types
export interface MenuItem {
  key: string;
  label: string;
  screen?: string;
  adminOnly?: boolean;
  icon?: string;
}

export interface DashboardStats {
  totalOrders: number;
  monthlySpend: number;
  pendingOrders: number;
  favoriteProducts: number;
}

export interface QuickAction {
  key: string;
  label: string;
  icon: string;
  onPress?: () => void;
}

export interface SettingItem {
  key: string;
  label: string;
  type: "toggle" | "action" | "info";
  value?: boolean | string;
  onPress?: () => void;
  dangerous?: boolean;
}

export interface SettingGroup {
  title: string;
  items: SettingItem[];
}

// Navigation types
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Main: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  OrderHistory: undefined;
  PaymentMethods: undefined;
  DeliveryAddresses: undefined;
  Settings: undefined;
};

export type TabParamList = {
  Home: undefined;
  Products: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};
