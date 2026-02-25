import { useContext } from "react";
import { ThemeContext } from "./Provider";

const useThemeStore = () => useContext(ThemeContext);

export { useThemeStore }