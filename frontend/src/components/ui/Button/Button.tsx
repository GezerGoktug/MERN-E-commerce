import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import styles from "./Button.module.scss";
import { IconType } from "react-icons";
import clsx from "clsx";
import { BiLoaderCircle } from "react-icons/bi";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: IconType;
  rightIcon?: IconType;
  rightIconSize?: number;
  leftIconSize?: number;
}

const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  leftIconSize = 20,
  rightIconSize = 20,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        { [styles.loading]: loading },
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {!loading && LeftIcon && (
        <LeftIcon size={leftIconSize} className={styles.iconLeft} />
      )}
      {loading ? (
        <>
          <BiLoaderCircle size={20} className={styles.loaderIcon} />
          <span className={styles.loaderText}>Loading</span>
        </>
      ) : (
        <>{children}</>
      )}
      {!loading && RightIcon && (
        <RightIcon size={rightIconSize} className={styles.iconRight} />
      )}
    </button>
  );
};

export default Button;
