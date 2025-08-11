import productStore from "./productStore";

export const setPageCount = (pageCount: number) =>
  productStore.getState().__setPageCount(pageCount);
export const setMaxPrice = (price: number) =>
  productStore.getState().__setMaxPrice(price);
