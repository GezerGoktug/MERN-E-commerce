import useAuthStore from "./authStore";

export const useAccount = () => useAuthStore((state) => state.user);

export const isAccess = () => useAuthStore.getState().user !== null;

export const isAdmin = () => useAuthStore.getState().user?.role === "ADMIN";
