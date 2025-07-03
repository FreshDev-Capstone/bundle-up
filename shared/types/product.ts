interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  eggColor?: string;
  eggCount: number;
  imageUrl: string;
  b2cPrice: number;
  b2bPrice: number;
  inventoryByCarton: number;
  inventoryByBox: number;
  isAvailable: boolean;
  isActive: boolean;
}

export type { Product };
