import React, { useState, useRef, useEffect } from "react";
import styles from "./CategorySlider.module.css";

interface Category {
  Category_ID: number | string;
  Category_Name?: string;
  Category_Image?: string;
}

interface CategorySliderProps {
  categories: Category[];
  onCategoryClick: (categoryId: number | string) => void;
}

const CategorySlider = ({
  categories,
  onCategoryClick,
}: CategorySliderProps) => {
  const [imageErrors, setImageErrors] = useState<
    Record<string | number, boolean>
  >({});
  const [translateX, setTranslateX] = useState(0);
  const [cardWidth, setCardWidth] = useState(66); 
  const sliderRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const startTranslateX = useRef(0); 
  const isDragging = useRef(false);

  useEffect(() => {
    const updateCardWidth = () => {
      let width = 66;
      if (window.innerWidth >= 600) width = 114;
      else if (window.innerWidth >= 425) width = 79;
      setCardWidth(width);
    };
    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  // Функция нормализации названия
  const normalizeTitle = (title: string): string => {
    if (!title) return "";
    return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
  };

  // Обработка ошибки изображения
  const handleImageError = (categoryId: number | string) => {
    setImageErrors((prev) => ({ ...prev, [categoryId]: true }));
  };

  // Начало drag (touch или mouse)
  const handleStart = (clientX: number) => {
    startX.current = clientX;
    currentX.current = clientX;
    startTranslateX.current = translateX;
    isDragging.current = true;
  };

  // Движение drag
  const handleMove = (clientX: number) => {
    if (!isDragging.current) return;
    currentX.current = clientX;
    const deltaX = currentX.current - startX.current;
    setTranslateX(startTranslateX.current + deltaX); 
  };

  // Конец drag
  const handleEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const deltaX = currentX.current - startX.current;
    const gap = 5; // Из CSS
    const step = cardWidth + gap; 
    const threshold = cardWidth * 0.3; 
    let newTranslateX = startTranslateX.current; 

    if (deltaX > threshold) {
      // Свайп вправо — показываем предыдущие (сдвигаем влево)
      newTranslateX = Math.min(0, startTranslateX.current + step);
    } else if (deltaX < -threshold) {
      // Свайп влево — показываем следующие (сдвигаем вправо)
      const maxTranslate = -(filteredCategories.length - 1) * step;
      newTranslateX = Math.max(maxTranslate, startTranslateX.current - step);
    }
    // Если свайп мал, остаёмся на месте (newTranslateX = startTranslateX.current)
    setTranslateX(newTranslateX);
  };

  // Touch-события
  const handleTouchStart = (e: React.TouchEvent) =>
    handleStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) =>
    handleMove(e.touches[0].clientX);
  const handleTouchEnd = handleEnd;

  // Mouse-события для десктопа
  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleMouseUp = handleEnd;

  // Фильтрация категорий
  const filteredCategories = categories.filter((category) => {
    const hasValidImage =
      category.Category_Image &&
      typeof category.Category_Image === "string" &&
      category.Category_Image.trim() !== "" &&
      category.Category_Image.toLowerCase() !== "null" &&
      category.Category_Image.toLowerCase() !== "undefined";
    return hasValidImage;
  });

  if (filteredCategories.length === 0) {
    return (
      <div className={styles.categorySlider}>Нет категорий для отображения</div>
    );
  }

  return (
    <div className={styles.categorySlider}>
      <div
        className={styles.sliderContainer}
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging.current ? "none" : "transform 0.3s ease",
        }}
      >
        {filteredCategories.map((category) => (
          <div
            key={category.Category_ID}
            className={styles.categoryCard}
            onClick={() => onCategoryClick(category.Category_ID)}
          >
            <div className={styles.imageContainer}>
              {!imageErrors[category.Category_ID] ? (
                <img
                  src={category.Category_Image}
                  alt={category.Category_Name || "Category"}
                  className={styles.categoryImage}
                  onError={() => handleImageError(category.Category_ID)}
                />
              ) : (
                <div className={styles.placeholder}>
                  {normalizeTitle(category.Category_Name || "Категория")}
                </div>
              )}
            </div>
            {category.Category_Name && (
              <div className={styles.categoryTitle}>
                {normalizeTitle(category.Category_Name)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;

