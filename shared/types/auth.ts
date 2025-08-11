// Authentication related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  companyName?: string; // Optional company name for B2B registration
}

export interface GoogleAuthData {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string; // For B2B users
  accountType: "B2B" | "B2C" | "ADMIN";
  brand?: string;
  token?: string;
  googleId?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
}

export interface AuthFormConfig {
  brandType: "B2B" | "B2C";
  logo: any; // Image source (require() or { uri: string })
  subtitle: string;
  showCompanyName?: boolean; // Whether to show company name field
}

export interface AuthFormProps {
  mode: "login" | "signup";
  onSubmit: (values: RegisterData) => void;
  initialValues?: Partial<RegisterData>;
  loading?: boolean;
  error?: string | null;
  keyboardVisible?: boolean;
  config?: AuthFormConfig; // Optional config for branding
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}
