import { useState, useEffect } from "react";
import { Product } from "../../shared/types/product";
import { API_BASE_URL } from "../utils/constants";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(
          `[useProducts] Fetching products from: ${API_BASE_URL}/products`
        );

        const response = await fetch(`${API_BASE_URL}/products?limit=50`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(
          `[useProducts] Received ${data.data?.products?.length || 0} products`
        );

        if (data.success && data.data?.products) {
          // Convert string prices back to numbers for the frontend
          const productsWithNumericPrices = data.data.products.map(
            (product: any) => ({
              ...product,
              b2cPrice: parseFloat(product.b2cPrice),
              b2bPrice: parseFloat(product.b2bPrice),
            })
          );

          setProducts(productsWithNumericPrices);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("[useProducts] Error fetching products:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const refetch = async () => {
    setError(null);
    // Re-fetch products by calling the same logic
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/products?limit=50`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success && data.data?.products) {
          const productsWithNumericPrices = data.data.products.map(
            (product: any) => ({
              ...product,
              b2cPrice: parseFloat(product.b2cPrice),
              b2bPrice: parseFloat(product.b2bPrice),
            })
          );

          setProducts(productsWithNumericPrices);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("[useProducts] Error refetching products:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch products"
        );
      } finally {
        setLoading(false);
      }
    };

    await fetchProducts();
  };

  return { products, loading, error, refetch };
};
