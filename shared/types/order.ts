interface Order {
  id: number;
  userId: number;
  products: {
    productId: number;
    quantity: number;
  }[];
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export type { Order };
