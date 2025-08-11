interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  product_color?: string;
  product_count: number;
  image_url: string;
  // API fields (snake_case)
  b2c_price: number;
  b2b_price: number;
  inventory_by_carton: number;
  inventory_by_box: number;
  is_available: boolean;
  is_active: boolean;
  created_at: string;
  // Frontend converted fields (camelCase)
  b2cPrice?: number;
  b2bPrice?: number;
}

export type { Product };
