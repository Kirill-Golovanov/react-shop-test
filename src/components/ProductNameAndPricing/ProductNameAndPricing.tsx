import styles from "./ProductNameAndPricing.module.css";

interface ProductNameAndPricingProps {
  name: string;
  price: number;
  old_price?: number | null; // Опционально
}

const ProductNameAndPricing = ({
  name,
  price,
  old_price,
}: ProductNameAndPricingProps) => {
  // Расчёт скидки (если old_price существует и больше price)
  const discount =
    old_price && old_price > price
      ? Math.round(((old_price - price) / old_price) * 100)
      : null;

  // Форматирование цены (добавлены пробелы для читаемости 1 000 ₽)
  const formatPrice = (p: number) => new Intl.NumberFormat("ru-RU").format(p);

  return (
    <div className={styles.container}>
      <div className={styles.pricingBlock}>
        <span className={styles.currentPrice}>{formatPrice(price)} ₽</span>
        {old_price && old_price > price && (
          <span className={styles.oldPrice}>{formatPrice(old_price)} ₽</span>
        )}
        {discount && <span className={styles.discountBadge}>-{discount}%</span>}
      </div>
      <h3 className={styles.productName}>{name}</h3>
    </div>
  );
};

export default ProductNameAndPricing;


