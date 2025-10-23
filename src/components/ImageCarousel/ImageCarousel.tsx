import { useState, useRef } from "react";
import styles from "./ImageCarousel.module.css";

export interface CarouselItem {
  imageUrl: string;
  description: string;
}

interface ImageCarouselProps {
  items: CarouselItem[];
  fallbackText?: string;
  onItemClick?: (item: CarouselItem, index: number) => void;
}

const ImageCarousel = ({
  items,
  fallbackText = "Изображение недоступно",
  onItemClick,
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Проверка данных
  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];
  if (!currentItem) {
    return null;
  }

  // Проверка валидности URL
  const isValidUrl = currentItem.imageUrl && /^https?:\/\//.test(currentItem.imageUrl);

  // Обработчики свайпов
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;

    // Если сдвиг больше 30px, меняем слайд
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        // Свайп влево → следующий слайд
        setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else {
        // Свайп вправо → предыдущий слайд
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
      setIsDragging(false); // Завершаем drag после смены слайда
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={styles.container}
      ref={carouselRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.imageContainer}>
        {isValidUrl ? (
          <img
            src={currentItem.imageUrl}
            alt={currentItem.description || "Изображение"}
            className={styles.image}
            onClick={() => onItemClick && onItemClick(currentItem, currentIndex)}
            onError={(e) => {
              if (!(e.target instanceof HTMLImageElement)) return;
              e.target.style.display = "none";
              const textElement = document.createElement("p");
              textElement.className = styles.fallbackText;
              textElement.textContent = fallbackText;
              if (e.target.parentElement) {
                e.target.parentElement.appendChild(textElement);
              }
            }}
          />
        ) : (
          <p className={styles.fallbackText}>{fallbackText}</p>
        )}
      </div>

      {/* Точки индикации (кликабельные как запасной вариант) */}
      {items.length > 1 && (
        <div className={styles.dots}>
          {items.map((_, index) => (
            <button
              key={`dot-${index}`}
              className={`${styles.dot} ${index === currentIndex ? styles.active : ""}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Перейти к слайду ${index + 1}`}
              aria-current={index === currentIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
