import { z } from 'zod';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerCustomerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().optional(),
});

export const registerBusinessSchema = registerCustomerSchema.extend({
  company_name: z.string().min(1, 'Company name is required').max(255),
  tax_id: z.string().optional(),
  billing_email: z.string().email().optional(),
});

export const updateProfileSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  first_name: z.string().min(1, 'First name is required').max(100).optional(),
  last_name: z.string().min(1, 'Last name is required').max(100).optional(),
  phone: z.string().optional(),
  company_name: z.string().min(1, 'Company name is required').max(255).optional(),
  tax_id: z.string().optional(),
  billing_email: z.string().email('Invalid billing email').optional(),
});

export const changePasswordSchema = z.object({
  current_password: z.string().min(8, 'Current password must be at least 8 characters'),
  new_password: z.string().min(8, 'New password must be at least 8 characters'),
});

// ─── Product ──────────────────────────────────────────────────────────────────

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(100).default(24),
  category: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  farming_method: z.string().optional(),
  search: z.string().optional(),
  is_available: z.coerce.boolean().optional(),
});

// ─── Cart ─────────────────────────────────────────────────────────────────────

export const addToCartSchema = z.object({
  product_id: z.number().int().positive(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity must be 0 or more'),
});

// ─── Order ────────────────────────────────────────────────────────────────────

export const createOrderSchema = z.object({
  shipping_address_id: z.number().int().positive(),
  billing_address_id: z.number().int().positive().optional(),
  notes: z.string().max(1000).optional(),
});

// ─── Address ──────────────────────────────────────────────────────────────────

export const addressSchema = z.object({
  label: z.string().max(100).nullable().optional(),
  street_line1: z.string().min(1, 'Street address is required').max(255),
  street_line2: z.string().max(255).nullable().optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  zip: z.string().min(5, 'ZIP code is required').max(20),
  country: z.string().min(2).max(100).default('US'),
  is_default: z.boolean().default(false),
});

// ─── Type exports ─────────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterCustomerInput = z.infer<typeof registerCustomerSchema>;
export type RegisterBusinessInput = z.infer<typeof registerBusinessSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
