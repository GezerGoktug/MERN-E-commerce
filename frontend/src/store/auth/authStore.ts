import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface UserType {
  email: string;
  name: string;
  lastLoggedIn: Date;
  role: "ADMIN" | "USER";
  image: string;
}

type Store = {
  user: UserType | null;
  __setUser: (user: UserType) => void;
  __clearUser: () => void;
};

const authStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      __setUser: (user) =>
        set(() => {
          return {
            user: user,
          };
        }),
      __clearUser: () =>
        set(() => {
          return {
            user: null,
          };
        }),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
      
    }
  )
);

export default authStore;
