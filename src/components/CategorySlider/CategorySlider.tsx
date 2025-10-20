import React, { useState, useRef } from "react";
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
  const sliderRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  // Функция нормализации названия: первая буква заглавная, остальные строчные
  const normalizeTitle = (title: string): string => {
    if (!title) return "";
    return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
  };

  // Функция для обработки ошибки загрузки изображения
  const handleImageError = (categoryId: number | string) => {
    setImageErrors((prev) => ({ ...prev, [categoryId]: true }));
  };

  // Обработчики свайпа
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = startX.current;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    currentX.current = e.touches[0].clientX;
    const deltaX = currentX.current - startX.current;
    setTranslateX(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const deltaX = currentX.current - startX.current;
    const threshold = 50;
    const cardWidth = 66;
    let newTranslateX = 0;

    if (deltaX > threshold) {
      // Свайп вправо — сдвигаем влево (показываем предыдущие)
      newTranslateX = Math.min(0, translateX + cardWidth);
    } else if (deltaX < -threshold) {
      // Свайп влево — сдвигаем вправо (показываем следующие)
      const maxTranslate = -(filteredCategories.length - 1) * cardWidth;
      newTranslateX = Math.max(maxTranslate, translateX - cardWidth);
    }
    setTranslateX(newTranslateX);
  };

  // Фильтрация: показываем только категории с валидными изображениями
  const filteredCategories = categories.filter((category) => {
    const hasValidImage =
      category.Category_Image &&
      typeof category.Category_Image === "string" &&
      category.Category_Image.trim() !== "" &&
      category.Category_Image.toLowerCase() !== "null" &&
      category.Category_Image.toLowerCase() !== "undefined";
    return hasValidImage;
  });

  return (
    <div className={styles.categorySlider}>
      <div
        className={styles.sliderContainer}
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(${translateX}px)` }}
      >
        {filteredCategories.map((category) => {
          const isImageError = imageErrors[category.Category_ID] || false;

          return (
            <div
              key={category.Category_ID}
              className={styles.categoryCardLink}
              role="button"
              tabIndex={0}
              onClick={() => onCategoryClick(category.Category_ID)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onCategoryClick(category.Category_ID);
              }}
            >
              {!isImageError ? (
                <img
                  src={category.Category_Image}
                  alt={category.Category_Name || "Категория"}
                  className={styles.categoryImage}
                  onError={() => handleImageError(category.Category_ID)}
                />
              ) : (
                <div className={styles.noImageMessage}>
                  <span>Нет фото</span>
                </div>
              )}
              {category.Category_Name && (
                <p className={styles.categoryName}>
                  {normalizeTitle(category.Category_Name)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySlider;
