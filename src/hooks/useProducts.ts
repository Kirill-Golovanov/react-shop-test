import { useState, useEffect, useRef } from "react";
import { getDataForPage } from "../services/getDataForPage";
import { Product } from "../types/Product";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dataLoaded = useRef<boolean>(false);

  const fetchProducts = async () => {
    if (dataLoaded.current) {
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const result = await getDataForPage();

      const newProducts = result.products;
      const hasChanged =
        newProducts.length !== products.length ||
        (newProducts.length > 0 &&
          products.length > 0 &&
          newProducts[0].id !== products[0].id);
      if (hasChanged) {
        setProducts(newProducts);
      } else {
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
      dataLoaded.current = true;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
};
