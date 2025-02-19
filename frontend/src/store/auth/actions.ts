import authStore, { UserType } from "./authStore";

export const setUser = (user: UserType) => authStore.getState().__setUser(user);
export const clearUser = () => authStore.getState().__clearUser();


