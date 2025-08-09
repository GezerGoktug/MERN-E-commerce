import themeStore, { ThemeType } from "./themeStore";

export const setTheme = (theme: ThemeType) => themeStore.getState().__setTheme(theme);
