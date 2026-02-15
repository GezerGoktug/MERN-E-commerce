import clsx from "clsx";
import { useTheme } from "../../../store/theme/hooks";
import styles from "./Logo.module.scss";

interface LogoProps {
  className?: string
  isAdminLogo?: boolean
}

const LOGO_SOURCES = {
  ADMIN: { dark: "/admin-logo-dark.png", light: "/admin-logo.png" },
  DEFAULT: { dark: "/logo_dark.png", light: "/logo.png" },
}

const Logo = ({ className, isAdminLogo = false }: LogoProps) => {
  const theme = useTheme();
  return (
    <div className={clsx(styles.logo, className)}>
      <img src={isAdminLogo ? LOGO_SOURCES.ADMIN[theme || "light"] : LOGO_SOURCES.DEFAULT[theme || "light"]} alt="logo" />
    </div>
  );
};

export default Logo;
