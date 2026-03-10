// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'business' | 'admin';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessAccount {
  id: number;
  user_id: number;
  company_name: string;
  tax_id: string | null;
  billing_email: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: number;
  user_id: number;
  label: string | null;
  street_line1: string;
  street_line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokenPayload {
  sub: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// ─── Product & Catalog ────────────────────────────────────────────────────────

export type FarmingMethod = 'Cage Free' | 'Pasture Raised' | 'Free Range' | null;
export type PackagingUnit = 'carton' | 'case';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
}

export interface Product {
  id: number;
  sku: string;
  legacy_product_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  category_id: number;
  product_type: string | null;
  product_color: string | null;
  product_count: number | null;
  product_size: string | null;
  farming_method: FarmingMethod;
  packaging_unit: PackagingUnit;
  case_pack: number;
  /** Retail price per carton (B2C) */
  b2c_unit_price: number;
  /** Wholesale price per case (B2B) */
  b2b_case_price: number;
  primary_image: string | null;
  is_available: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: number;
  product_id: number;
  inventory_by_carton: number;
  inventory_by_case: number;
  updated_at: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface Cart {
  id: number;
  user_id: number | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  created_at: string;
  updated_at: string;
}

export interface CartWithItems extends Cart {
  items: (CartItem & { product: Product })[];
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'failed';

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shipping_address_id: number | null;
  billing_address_id: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  line_total: number;
  created_at: string;
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { product: Product })[];
  shipping_address: Address | null;
  billing_address: Address | null;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterCustomerRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface RegisterBusinessRequest extends RegisterCustomerRequest {
  company_name: string;
  tax_id?: string;
  billing_email?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  profile: UserProfile;
  business_account?: BusinessAccount;
}
