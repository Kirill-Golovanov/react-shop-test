import React, { useState } from "react";
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

  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];
  if (!currentItem) {
    return null;
  }

  // Проверка: если imageUrl пустой или неправильный, используем fallback-текст
  const isValidUrl =
    currentItem.imageUrl && currentItem.imageUrl.startsWith("https://");

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        {isValidUrl ? (
          <img
            src={currentItem.imageUrl}
            alt={currentItem.description || "Изображение"}
            className={styles.image}
            onClick={() =>
              onItemClick && onItemClick(currentItem, currentIndex)
            }
            onError={(e) => {
              console.log(
                "BlockCarousel: Image failed to load for URL:",
                currentItem.imageUrl
              );
              (e.target as HTMLImageElement).style.display = "none";
              const textElement = document.createElement("p");
              textElement.className = styles.fallbackText;
              textElement.textContent = fallbackText;
              (e.target as HTMLImageElement).parentNode?.appendChild(
                textElement
              );
            }}
          />
        ) : (
          <p className={styles.fallbackText}>{fallbackText}</p>
        )}
      </div>

      {/* Dots */}
      {items.length > 1 && (
        <div className={styles.dots}>
          {items.map((_, index) => (
            <button
              key={`dot-${index}`}
              className={`${styles.dot} ${
                index === currentIndex ? styles.active : ""
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Показать элемент ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
