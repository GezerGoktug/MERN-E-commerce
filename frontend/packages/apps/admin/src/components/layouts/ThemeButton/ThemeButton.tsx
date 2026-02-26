import { FaMoon } from "react-icons/fa6";
import styles from "./ThemeButton.module.scss";
import { IoSunny } from "react-icons/io5";
import { useThemeStore } from "@forever/theme-kit"
const ThemeButton = () => {
  const { theme, setTheme } = useThemeStore();
  return (
    <div
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={styles.theme_btn}
    >
      {theme === "dark" ? <FaMoon size={25} /> : <IoSunny size={25} />}
    </div>
  );
};

export default ThemeButton;
