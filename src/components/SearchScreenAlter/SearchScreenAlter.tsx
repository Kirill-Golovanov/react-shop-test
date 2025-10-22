import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import searchIcon from "../../assets/icons/icon-search.svg";
import styles from "./SearchScreen.module.css";
import ReactDOM from "react-dom";
import { Product } from "../../types/Product";

interface SearchScreenAlterProps {
  products: Product[];
  onClose: () => void;
  onOpen: () => void;
}
const SearchScreenAlter = ({
  products,
  onClose,
  onOpen,
}:SearchScreenAlterProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(""); // Для debounce
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Функция для запроса к API (queryFn для useQuery)
  const fetchProducts = async (searchQuery: string) => {
    const response = await fetch(
      'https://noxer-test.ru/webapp/api/products/filter?per_page=50&page=1',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search: searchQuery }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP ошибка: ${response.status}`);
    }
    const data = await response.json();
    if (data.status !== "ok") {
      throw new Error("Ошибка API: " + (data.message || "Неизвестная ошибка"));
    }
    return data.products || [];
  };

  // useQuery для поиска (с debounce через debouncedQuery)
  const { data: filteredProducts = [], isLoading, error } = useQuery({
    queryKey: ['products-search', debouncedQuery], // Ключ зависит от debouncedQuery
    queryFn: () => fetchProducts(debouncedQuery),
    enabled: debouncedQuery.trim() !== '', // Запрос только если debouncedQuery не пустой
    staleTime: 5 * 60 * 1000, // Кеш на 5 минут (опционально)
  });

  // Эффект для debounce: обновляем debouncedQuery с задержкой 300ms
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Функция для расчета позиции dropdown с учётом header/footer
  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const headerHeight = 30; // высота header
      const footerHeight = 100; //высота footer
      const viewportHeight = window.innerHeight;
      const availableHeight = viewportHeight - headerHeight - footerHeight;

      setDropdownStyle({
        top: Math.max(rect.bottom, headerHeight),
        left: rect.left,
        width: rect.width,
        maxHeight: `${availableHeight}px`,
        overflowY: "auto",
      });
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [showDropdown]);

  useEffect(() => {
    updateDropdownPosition();
    window.addEventListener("resize", updateDropdownPosition);
    return () => window.removeEventListener("resize", updateDropdownPosition);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleFocus = () => {
    onOpen();
    setShowDropdown(true);
    updateDropdownPosition();
  };

  const handleBlur = () => {
    setTimeout(() => {
      setQuery("");
      setDebouncedQuery("");
      setShowDropdown(false);
      onClose();
    }, 200);
  };

  const handleNavigate = (product: any) => {
    if (!product.id) {
      return;
    }
    setShowDropdown(false);
    onClose();
  };

  // Хелпер для получения URL изображения
  const getProductImage = (product: any) => {
    const mainImage =
      product.images?.find((img: any) => img.MainImage) || product.images?.[0];
    return mainImage?.Image_URL || null;
  };

  return (
    <div className={styles.searchScreen}>
      <div className={styles.searchContainer}>
        <img
          src={searchIcon}
          alt="Иконка поиска"
          className={styles.searchIcon}
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Найти товары"
          className={styles.searchInput}
        />
      </div>

      {/* Рендерим dropdown через портал, чтобы он был поверх страницы */}
      {showDropdown &&
        ReactDOM.createPortal(
          <div className={styles.searchDropdown} style={dropdownStyle}>
            {/* Весь контент dropdown остаётся без изменений */}
            {!query && (
              <div className={styles.searchSection}>
                <h4 className={styles.sectionTitle}>Часто ищут</h4>
                <div className={styles.searchItems}>
                  {products.slice(0, 10).map((product, index) => (
                    <div
                      key={`popular-${product.id || `fallback-${index}`}`}
                      className={styles.searchItem}
                      onClick={() => handleNavigate(product)}
                    >
                      <img src={searchIcon} alt="Иконка поиска" />
                      <span>{product.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Loading для поиска */}
            {query && isLoading && (
              <div className={styles.searchSection}>
                <p>Ищем...</p>
              </div>
            )}
            {/* Ошибка поиска */}
            {query && error && (
              <div className={styles.searchSection}>
                <p style={{ color: "red" }}>{error.message}</p>
              </div>
            )}

            {/* "Результаты поиска" показываются только если query не пустой, нет loading и есть результаты */}
            {query && !isLoading && !error && filteredProducts.length > 0 && (
              <div className={styles.searchSection__withCards}>
                {/* <h4 className={styles.sectionTitle}>Результаты поиска</h4> */}
                <div className={styles.searchItems}>
                  {filteredProducts.map((product: Product, index: any) => {
                    const imageUrl = getProductImage(product);
                    const key = product.id || `fallback-${index}`;
                    const hasError = imageErrors[key];
                    return (
                      <div
                        key={key}
                        className={styles.searchItem__сard}
                        onClick={() => handleNavigate(product)}
                      >
                        {imageUrl && !hasError && (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "10px",
                            }}
                            onError={() => {
                              setImageErrors((prev) => ({
                                ...prev,
                                [key]: true,
                              }));
                            }}
                          />
                        )}
                        {(!imageUrl || hasError) && (
                          <span className={styles.noPhoto}>нет фото</span>
                        )}
                        <span>{product.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {/* "Ничего не найдено" показывается только если query не пустой, нет loading, нет ошибки и результатов нет */}
            {query && !isLoading && !error && filteredProducts.length === 0 && (
              <div className={styles.searchSection}>
                <h4 className={styles.sectionTitle}>Ничего не найдено</h4>
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

export default SearchScreenAlter;

