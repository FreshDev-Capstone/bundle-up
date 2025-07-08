import { useState, useEffect } from "react";
import { Product } from "../../shared/types/product";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch('/api/products');
        // const data = await response.json();
        // setProducts(data);

        // Mock data for now
        const mockProducts: Product[] = [
          {
            id: 1,
            name: "Sample Product 1",
            description: "This is a sample product",
            category: "Electronics",
            eggColor: "brown",
            eggCount: 12,
            imageUrl: "https://picsum.photos/300/200?random=1",
            b2cPrice: 29.99,
            b2bPrice: 24.99,
            inventoryByCarton: 100,
            inventoryByBox: 50,
            isAvailable: true,
            isActive: true,
          },
          {
            id: 2,
            name: "Sample Product 2",
            description: "This is another sample product",
            category: "Clothing",
            eggColor: "white",
            eggCount: 24,
            imageUrl: "https://picsum.photos/300/200?random=2",
            b2cPrice: 39.99,
            b2bPrice: 34.99,
            inventoryByCarton: 50,
            inventoryByBox: 25,
            isAvailable: true,
            isActive: true,
          },
        ];
        setProducts(mockProducts);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const refetch = () => {
    setError(null);
    setLoading(true);
    // Re-fetch products
  };

  return { products, loading, error, refetch };
};
