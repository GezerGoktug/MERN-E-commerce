import type { ExtendedUserType } from "../../../domain/entities/user.entity";
import authStore from "./authStore";

export const setUser = (user: ExtendedUserType) => authStore.getState().__setUser(user);
export const clearUser = () => authStore.getState().__clearUser();


