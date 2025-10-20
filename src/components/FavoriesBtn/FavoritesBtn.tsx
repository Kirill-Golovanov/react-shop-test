import { useState } from "react";
import styles from "./FavoritesBtn.module.css";
import { ReactComponent as HeartIcon } from "../../assets/icons/icon-like_off.svg";
import { ReactComponent as HeartFilledIcon } from "../../assets/icons/icon-like_on.svg";

interface FavoritesBtnProps {
  isFavorite?: boolean;
  onToggle?: (isFav: boolean) => void;
  className?: string;
}

const FavoritesBtn = ({
  isFavorite: initialIsFavorite = false,
  onToggle,
  className,
}: FavoritesBtnProps) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const handleClick = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <button
      className={`${styles.btn} ${className}`.trim()}
      onClick={handleClick}
      title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
    >
      {isFavorite ? (
        <HeartFilledIcon className={styles.btn__icon} />
      ) : (
        <HeartIcon className={styles.btn__icon} />
      )}
    </button>
  );
};

export default FavoritesBtn;
