import React from "react";
import styles from "./ButtonWithIcon.module.css";

interface ButtonWithIconProps {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
  disabled?: boolean;
  text?: string;
  style?: React.CSSProperties;
}

const ButtonWithIcon = ({
  icon,
  onClick,
  className = "",
  title,
  disabled = false,
  text,
  style,
}: ButtonWithIconProps) => {
  return (
    <button
      className={`${styles.btn} ${className}`.trim()}
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={style}
    >
      <span className={styles.btn__icon}>{icon}</span>
      {text && <span className={styles.btn__text}>{text}</span>}
    </button>
  );
};

export default ButtonWithIcon;


