import clsx from "clsx";
import { useThemeStore } from "@forever/theme-kit";
import styles from "./Logo.module.scss";

interface LogoProps {
  className?: string;
  isAdminLogo?: boolean;
}

const LOGO_SOURCES = {
  ADMIN: { dark: "/admin-logo-dark.png", light: "/admin-logo.png" },
  DEFAULT: { dark: "/logo_dark.png", light: "/logo.png" },
};

const Logo = ({ className, isAdminLogo = false }: LogoProps) => {
  const { theme } = useThemeStore();

  return (
    <div className={clsx(styles.logo, className)}>
      <img
        src={
          isAdminLogo
            ? LOGO_SOURCES.ADMIN[theme || "light"]
            : LOGO_SOURCES.DEFAULT[theme || "light"]
        }
        alt="logo"
      />
    </div>
  );
};

export default Logo;
