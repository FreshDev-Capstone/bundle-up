import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterCustomerRequest,
  RegisterBusinessRequest,
  Product,
  PaginatedResponse,
  Cart,
  CartWithItems,
  Order,
  OrderWithItems,
  Address,
} from '@bundle-up/shared-types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const res = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      const data = (await res.json()) as ApiResponse<T>;
      return data;
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Network error. Please try again.',
      };
    }
  }

  // ─── Auth ─────────────────────────────────────────────────────────────

  login(body: LoginRequest) {
    return this.request<AuthResponse>('POST', '/auth/login', body);
  }

  registerCustomer(body: RegisterCustomerRequest) {
    return this.request<AuthResponse>('POST', '/auth/register/customer', body);
  }

  registerBusiness(body: RegisterBusinessRequest) {
    return this.request<AuthResponse>('POST', '/auth/register/business', body);
  }

  me() {
    return this.request<AuthResponse>('GET', '/auth/me');
  }

  updateMe(body: {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    company_name?: string;
    tax_id?: string;
    billing_email?: string;
  }) {
    return this.request<Omit<AuthResponse, 'token'>>('PATCH', '/auth/me', body);
  }

  changePassword(body: { current_password: string; new_password: string }) {
    return this.request<null>('POST', '/auth/change-password', body);
  }

  // ─── Products ─────────────────────────────────────────────────────────

  getProducts(params?: Record<string, string | number | boolean>) {
    const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return this.request<PaginatedResponse<Product>>('GET', `/products${qs}`);
  }

  getProduct(idOrSlug: string | number) {
    return this.request<Product>('GET', `/products/${idOrSlug}`);
  }

  // ─── Cart ─────────────────────────────────────────────────────────────

  getCart() {
    return this.request<CartWithItems>('GET', '/cart');
  }

  addToCart(product_id: number, quantity: number) {
    return this.request<CartWithItems>('POST', '/cart/items', { product_id, quantity });
  }

  updateCartItem(itemId: number, quantity: number) {
    return this.request<CartWithItems>('PATCH', `/cart/items/${itemId}`, { quantity });
  }

  removeCartItem(itemId: number) {
    return this.request<CartWithItems>('DELETE', `/cart/items/${itemId}`);
  }

  clearCart() {
    return this.request<Cart>('DELETE', '/cart');
  }

  // ─── Orders ───────────────────────────────────────────────────────────

  createOrder(shipping_address_id: number, billing_address_id?: number) {
    return this.request<Order>('POST', '/orders', { shipping_address_id, billing_address_id });
  }

  getOrders() {
    return this.request<PaginatedResponse<Order>>('GET', '/orders');
  }

  getOrder(id: number) {
    return this.request<OrderWithItems>('GET', `/orders/${id}`);
  }

  // ─── Addresses ────────────────────────────────────────────────────────

  getAddresses() {
    return this.request<Address[]>('GET', '/addresses');
  }

  createAddress(body: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    return this.request<Address>('POST', '/addresses', body);
  }

  updateAddress(id: number, body: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    return this.request<Address>('PUT', `/addresses/${id}`, body);
  }

  deleteAddress(id: number) {
    return this.request<null>('DELETE', `/addresses/${id}`);
  }
}

export function createApiClient(baseUrl: string) {
  return new ApiClient(baseUrl);
}
