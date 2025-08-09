import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeType = "light" | "dark";

type Store = {
  theme: ThemeType | null;
  __setTheme: (theme: ThemeType) => void;
};
const systemTheme: ThemeType = window.matchMedia("(prefers-color-scheme:dark)")
  .matches
  ? "dark"
  : "light";

import { create } from "zustand";

const applyThemeToDOM = (theme: ThemeType) => {
  const body = document.getElementsByTagName("body");

  if (theme === "dark") body[0].classList.add("dark");
  else body[0].classList.remove("dark");
};

const themeStore = create<Store>()(
  persist(
    (set) => ({
      theme: null,
      __setTheme: (theme) => set(() => ({ theme })),
    }),
    {
      name: "theme",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && !state.theme) state.__setTheme(systemTheme);

        applyThemeToDOM(state?.theme ? state.theme : systemTheme);
      },
    }
  )
);

themeStore.subscribe((state) =>
  applyThemeToDOM(state.theme ? state.theme : "light")
);

export default themeStore;
