import useThemeStore from "./themeStore";

export const useTheme = () => useThemeStore((state) => state.theme);
