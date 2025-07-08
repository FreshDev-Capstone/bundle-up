import { useState, useEffect } from "react";
import { Product } from "../types";
import { getAllProducts, getProductsByCategory } from "../api/endpoints";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (category?: string) => {
    setLoading(true);
    setError(null);
    try {
      const [data, error] = category
        ? await getProductsByCategory(category)
        : await getAllProducts();

      if (error) {
        setError(error);
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const getEggProducts = () => {
    return products.filter((product: Product) =>
      product.category?.toLowerCase().includes("egg")
    );
  };

  const getProductsByColor = (color: string) => {
    return products.filter(
      (product: Product) =>
        product.eggColor?.toLowerCase() === color.toLowerCase()
    );
  };

  const calculatePrice = (product: Product, accountType: "B2B" | "B2C") => {
    return accountType === "B2B" ? product.b2bPrice : product.b2cPrice;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    getEggProducts,
    getProductsByColor,
    calculatePrice,
  };
};
