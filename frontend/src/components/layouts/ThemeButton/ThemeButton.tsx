import { FaMoon } from "react-icons/fa6";
import styles from "./ThemeButton.module.scss";
import { useTheme } from "../../../store/theme/hooks";
import { IoSunny } from "react-icons/io5";
import { setTheme } from "../../../store/theme/actions";

const ThemeButton = () => {
  const theme = useTheme();
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
