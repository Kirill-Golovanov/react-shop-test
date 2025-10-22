import { useActions } from "../../hooks/useActions";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import ImageCarousel, {
  CarouselItem,
} from "../../components/ImageCarousel/ImageCarousel";
import CategorySlider from "../../components/CategorySlider/CategorySlider";
// import SearchScreen from "../../components/SearchScreen/SearchScreen";
import styles from "./TaskPage.module.css";
import ProductCatalog from "../../components/ProductCatalog/ProductCatalog";
import SearchScreenAlter from "../../components/SearchScreenAlter/SearchScreenAlter";

const TaskPage: React.FC = () => {
  // const [isSearching, setIsSearching] = useState(false);

  const { actions, loading, error, refetch } = useActions();
  const {
    products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  // Преобразуем Action в CarouselItem
  const carouselItems: CarouselItem[] = actions.map((action) => ({
    imageUrl: action.image_url,
    description: action.description,
  }));

  return (
    <div className={styles.pageContainer}>
      <div className={styles.searchContainer}>
        {/* <SearchScreen
          products={products}
          onClose={() => {
            setIsSearching(false);
          }}
          onOpen={() => {
            setIsSearching(true);
          }}
        /> */}
        <SearchScreenAlter
          products={products}
          onClose={() => {
            // setIsSearching(false);
          }}
          onOpen={() => {
            // setIsSearching(true);
          }}
        />
      </div>
      <div className={styles.carouselContainer}>
        {loading ? (
          <div>Загрузка акций...</div>
        ) : error ? (
          <div>
            Ошибка загрузки акций: {error}
            <button onClick={refetch}>Повторить</button>
          </div>
        ) : (
          <ImageCarousel items={carouselItems} />
        )}
      </div>
      <div className={styles.sliderContainer}>
        {categoriesLoading ? (
          <div>Загрузка категорий...</div>
        ) : categoriesError ? (
          <div>
            Ошибка загрузки: {categoriesError}
            <button onClick={refetchCategories}>Повторить</button>
          </div>
        ) : (
          <CategorySlider
            categories={categories}
            onCategoryClick={(category) => {
              console.log("Клик на категорию:", category);
            }}
          />
        )}
      </div>
      <div className={styles.catalogContainer}>
        {productsLoading ? (
          <div>Загрузка товаров...</div>
        ) : productsError ? (
          <div>
            Ошибка загрузки товаров: {productsError}
            <button onClick={refetchProducts}>Повторить</button>
          </div>
        ) : (
          <ProductCatalog products={products} />
        )}
      </div>
    </div>
  );
};

export default TaskPage;
