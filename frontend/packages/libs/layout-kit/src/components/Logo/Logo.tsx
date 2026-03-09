import clsx from "clsx";
import { useThemeStore } from "@forever/theme-kit";
import styles from "./Logo.module.scss";

interface LogoProps {
  className?: string;
  isAdminLogo?: boolean;
}

const Logo = ({ className, isAdminLogo = false }: LogoProps) => {
  const { theme } = useThemeStore();
  const base = import.meta.env.BASE_URL as string;

  const logoSrc = isAdminLogo
    ? theme === "dark"
      ? `${base}admin-logo-dark.png`
      : `${base}admin-logo.png`
    : theme === "dark"
    ? `${base}logo_dark.png`
    : `${base}logo.png`;

  return (
    <div className={clsx(styles.logo, className)}>
      <img src={logoSrc} alt="logo" />
    </div>
  );
};

export default Logo;
