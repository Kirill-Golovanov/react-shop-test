// types/Product.ts
// Интерфейс для изображения продукта
export interface ProductImage {
  Image_URL: string; // URL изображения (строка)
  MainImage?: boolean; // Опционально: флаг главного изображения (true/false)
  alt?: string; // Опционально: альтернативный текст для доступности
}

// Основной интерфейс для продукта
export interface Product {
  id?: string | number; // Опциональный ID продукта
  name: string; // Название продукта (обязательное)
  price: number; // Цена в рублях (число)
  old_price?: number; // Цена в рублях (число)
  images?: ProductImage[]; // Массив изображений (опциональный, может быть пустым)
  description?: string; // Опциональное описание
  category?: string; // Опциональная категория
  marks?: { Mark_Name: string; color_code: string }[]; // Добавлено: массив меток с именем и цветом (опциональный)

}
