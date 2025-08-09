import { useTheme } from "../../../store/theme/hooks";
import styles from "./Logo.module.scss";

const Logo = () => {
  const theme = useTheme();
  return (
    <div className={styles.logo}>
      <img src={theme === "dark" ? "./logo_dark.png" : "./logo.png"} alt="" />
    </div>
  );
};

export default Logo;
