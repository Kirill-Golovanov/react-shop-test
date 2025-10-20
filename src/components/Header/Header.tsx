import styles from "./Header.module.css";
import ButtonWithIcon from "../ButtonWithIcon/ButtonWithIcon";
import { ReactComponent as CloseIcon } from "../../assets/icons/icon-close.svg";
import { ReactComponent as TgCanalIcon } from "../../assets/icons/icon_tg.svg";
import { ReactComponent as MoreIcon } from "../../assets/icons/icon-more.svg";

const Header = (): JSX.Element => {
  return (
    <header className={styles.header}>
      <div className={styles["header__navigation"]}>
        <ButtonWithIcon
          icon={<CloseIcon />}
          text="Закрыть"
          className={styles["close-button"]}
          style={{
            padding: "11px",
            backgroundColor: "rgba(198, 198, 198, 0.3)",
          }}
          title="Закрыть"
        />

        <ButtonWithIcon
          icon={<TgCanalIcon />}
          text="наш tg-канал"
          className={styles["tg-button"]}
          style={{
            padding: "3px",
            backgroundColor: "rgba(255, 255, 255, 1)",
          }}
          title="наш tg-канал"
        />

        <ButtonWithIcon
          icon={<MoreIcon />}
          className={styles["more-button"]}
          style={{
            backgroundColor: "rgba(198, 198, 198, 0.3)",
          }}
          title="more-button"
        />
      </div>
    </header>
  );
};

export default Header;
