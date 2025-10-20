import React from "react";
import styles from "./Footer.module.css";
import ButtonWithIcon from "../ButtonWithIcon/ButtonWithIcon";
import { ReactComponent as TgIcon } from "../../assets/icons/icon.svg";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as CatalogIcon } from "../../assets/icons/catalog.svg";
import { ReactComponent as FavoriteIcon } from "../../assets/icons/favorite.svg";
import { ReactComponent as CartIcon } from "../../assets/icons/cart.svg";
import { ReactComponent as AccountIcon } from "../../assets/icons/account.svg";

const Footer = (): JSX.Element => {
  return (
    <footer className={styles["footer"]}>
      <div className={styles["footer__top-wrapper"]}>
        <span className={styles["footer__note"]}>
          Разработано на платформе Noxer
        </span>

        <ButtonWithIcon
          icon={<TgIcon />}
          text="noxerai_bot"
          className={styles["bot-button"]}
          style={{
            padding: "5px",
            backgroundColor: "rgba(139, 139, 139, 0.1)",
          }}
          title="noxerai_bot"
        />
      </div>

      <div className={styles["footer__navigation"]}>
        <ButtonWithIcon
          icon={<HomeIcon />}
          className={styles["home-button"]}
          title="home-button"
        />

        <ButtonWithIcon
          icon={<CatalogIcon />}
          className={styles["catalog-button"]}
          title="catalog-button"
        />

        <ButtonWithIcon
          icon={<FavoriteIcon />}
          className={styles["favorite-button"]}
          title="favorite-button"
        />

        <ButtonWithIcon
          icon={<CartIcon />}
          className={styles["cart-button"]}
          title="cart-button"
        />

        <ButtonWithIcon
          icon={<AccountIcon />}
          className={styles["account-button"]}
          title="account-buttont"
        />
      </div>
    </footer>
  );
};

export default Footer;
