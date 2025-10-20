import { useState, useEffect, useRef } from "react";
import styles from "./ProductCatalog.module.css";
import ProductCard from "../ProductCard/ProductCard";

interface ProductCatalogProps {
  products: any[];
}

const ProductCatalog = (props: ProductCatalogProps): JSX.Element => {
  const { products } = props;
  const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const ITEMS_PER_PAGE = 6;

  // Функция загрузки следующих продуктов
  const loadMore = () => {
    if (isLoading || !hasMore || visibleProducts.length >= products.length) {
      setHasMore(false); // Дополнительная страховка
      return;
    }

    setIsLoading(true);
    const currentLength = visibleProducts.length;
    const nextProducts = products.slice(
      currentLength,
      currentLength + ITEMS_PER_PAGE
    );

    if (nextProducts.length > 0) {
      setVisibleProducts((prev) => [...prev, ...nextProducts]);
      // Пересчитываем hasMore после добавления
      setHasMore(currentLength + nextProducts.length < products.length);
    } else {
      setHasMore(false);
    }

    setIsLoading(false);
  };

  // Инициализация первых продуктов
  useEffect(() => {
    if (products.length > 0) {
      const initialProducts = products.slice(0, ITEMS_PER_PAGE);
      setVisibleProducts(initialProducts);
      setHasMore(products.length > ITEMS_PER_PAGE);
      setIsLoading(false); // Сбрасываем флаг
    } else {
      setVisibleProducts([]);
      setHasMore(false);
      setIsLoading(false);
    }
  }, [products]);

  // Настройка IntersectionObserver
  useEffect(() => {
    if (!hasMore || isLoading) {
      if (observer.current) {
        observer.current.disconnect();
      }
      return;
    }

    const currentObserver = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          !isLoading &&
          hasMore &&
          visibleProducts.length < products.length
        ) {
          loadMore();
        }
      },
      {
        threshold: 0.5,
        rootMargin: "100px",
      }
    );

    observer.current = currentObserver;

    if (loaderRef.current) {
      currentObserver.observe(loaderRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMore, products.length, visibleProducts.length]);

  return (
    <div className={styles["catalogContainer"]}>
      {visibleProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {hasMore && !isLoading && visibleProducts.length < products.length && (
        <div ref={loaderRef} className={styles.loader}>
          Загрузка...
        </div>
      )}
      {isLoading && (
        <div className={styles.loadingIndicator}>Загружаем продукты...</div>
      )}
    </div>
  );
};

export default ProductCatalog;
