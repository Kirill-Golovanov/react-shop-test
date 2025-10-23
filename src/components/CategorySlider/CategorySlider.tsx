import { useState, useRef, useEffect, useMemo } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(66);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  // Расчёт стиля для плавного перемещения
  const sliderStyle = useMemo(
    () => ({
      transform: `translateX(-${activeIndex * cardWidth}px)`,
      transition: isDragging.current ? "none" : "transform 0.3s ease",
    }),
    [activeIndex, cardWidth, isDragging.current]
  );

  // Измерение реальной ширины карточки при загрузке и изменении размера окна
  useEffect(() => {
    const updateCardWidth = () => {
      if (sliderRef.current) {
        const card = sliderRef.current.querySelector(
          ".categoryCard"
        ) as HTMLElement | null;
        if (card) {
          setCardWidth(card.offsetWidth);
        }
      }
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  // Нормализация названия категории
  const normalizeTitle = (title: string): string => {
    if (!title) return "";
    return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
  };

  // Обработка ошибки загрузки изображения
  const handleImageError = (categoryId: number | string) => {
    setImageErrors((prev) => ({ ...prev, [categoryId]: true }));
  };

  // Начало drag-события
  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.type.startsWith("touch")
      ? (e as React.TouchEvent).touches[0].clientX
      : (e as React.MouseEvent).clientX;
  };

  // Движение во время drag
  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;

    const clientX = e.type.startsWith("touch")
      ? (e as React.TouchEvent).touches[0].clientX
      : (e as React.MouseEvent).clientX;
    const deltaX = clientX - startX.current;

    // Порог для срабатывания свайпа (20% от ширины карточки)
    const threshold = cardWidth * 0.2;

    if (Math.abs(deltaX) > threshold) {
      setActiveIndex((prev) => {
        if (deltaX > 0) return Math.max(0, prev - 1); // Свайп вправо — предыдущий слайд
        return Math.min(categories.length - 1, prev + 1); // Свайп влево — следующий слайд
      });
      isDragging.current = false;
    }
  };

  // Завершение drag-события
  const handleEnd = () => {
    isDragging.current = false;
  };

  // Фильтрация категорий с валидными изображениями
  const filteredCategories = categories.filter((category) => {
    const hasValidImage =
      category.Category_Image &&
      typeof category.Category_Image === "string" &&
      category.Category_Image.trim() !== "" &&
      !["null", "undefined"].includes(category.Category_Image.toLowerCase());
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
        ref={sliderRef}
        className={styles.sliderContainer}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        style={sliderStyle}
      >
        {filteredCategories.map((category) => (
          <div
            key={category.Category_ID}
            className={styles.categoryCard}
            onClick={() => onCategoryClick(category.Category_ID)}
            tabIndex={0}
            aria-label={`Категория: ${
              category.Category_Name || "Без названия"
            }`}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft")
                setActiveIndex((prev) => Math.max(0, prev - 1));
              if (e.key === "ArrowRight")
                setActiveIndex((prev) =>
                  Math.min(filteredCategories.length - 1, prev + 1)
                );
            }}
          >
            <div className={styles.imageContainer}>
              {!imageErrors[category.Category_ID] ? (
                <img
                  src={category.Category_Image}
                  alt={category.Category_Name || "Категория"}
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


