import { useState } from "react";
import styles from "./ProductCard.module.css";
import { Product } from "../../types/Product";
import FavoritesBtn from "../FavoriesBtn/FavoritesBtn";
import ProductNameAndPricing from "../ProductNameAndPricing/ProductNameAndPricing";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Функция для получения начального индекса (главное изображение или первое)
  const getInitialIndex = (images: Product["images"]): number => {
    if (!images || images.length === 0) return 0;
    const mainIndex = images.findIndex((img) => img.MainImage === true);
    return mainIndex !== -1 ? mainIndex : 0;
  };

  const [currentIndex, setCurrentIndex] = useState(
    getInitialIndex(product.images)
  );

  const [isImageError, setIsImageError] = useState(false);

  const getCurrentImageUrl = (
    images: Product["images"],
    index: number
  ): string => {
    if (!images || images.length === 0) {
      return "";
    }
    return images[index]?.Image_URL || "";
  };

  const imageUrl = getCurrentImageUrl(product.images, currentIndex);

  const getTagDataArray = (): { text: string; color: string }[] => {
    if (!product.marks || product.marks.length === 0) {
      return [];
    }
    const tags = product.marks.map((mark, index) => {
      let text = "";
      switch (mark.Mark_Name.toLowerCase()) {
        case "premium":
          text = "ПРЕМИУМ";
          break;
        case "hit":
          text = "ХИТ";
          break;
        default:
          text = mark.Mark_Name.toUpperCase();
      }
      return { text, color: mark.color_code };
    });
    return tags;
  };

  const tagDataArray = getTagDataArray();

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardWrapper}>
        <div className={styles.imageContainer}>
          {isImageError ? (
            <div className={styles.noImageMessage}>Изображение недоступно</div>
          ) : (
            <img
              src={imageUrl}
              alt={product.name}
              className={styles.productImage}
              onError={() => setIsImageError(true)}
            />
          )}

          <div className={styles.tagsContainer}>
            {tagDataArray.map((tag, index) => (
              <div
                key={`tag-${index}`}
                className={styles.tag}
                style={{
                  backgroundColor: tag.color,
                }}
                title={tag.text}
              >
                <span className={styles.tagText}>{tag.text}</span>
              </div>
            ))}
          </div>

          {/* Dots для слайдера */}
          {product.images && product.images.length > 1 && (
            <div className={styles.dots}>
              {product.images.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${
                    index === currentIndex ? styles.active : ""
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Показать изображение ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <ProductNameAndPricing
          name={product.name}
          price={product.price}
          old_price={product.old_price}
        />
      </div>

      <button className={styles.selectButton}>Выбрать</button>

      <FavoritesBtn className={styles.favoriteButton} />
    </div>
  );
};

export default ProductCard;
