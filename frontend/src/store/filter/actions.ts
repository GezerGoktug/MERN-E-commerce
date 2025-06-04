import filterStore, { OprType } from "./filterStore";

export const setCategories = (category: string, opr: OprType) =>
  filterStore.getState().__setCategory(category, opr);
export const setSubCategories = (subCategory: string, opr: OprType) =>
  filterStore.getState().__setSubCategory(subCategory, opr);
export const nextPage = () => filterStore.getState().__nextPage();
export const prevPage = () => filterStore.getState().__prevPage();
export const setSearchQuery = (query: string) =>
  filterStore.getState().__setSearchQuery(query);
export const setPageCount = (pageCount: number) =>
  filterStore.getState().__setPageCount(pageCount);
export const setMinPrice = (price: number) =>
  filterStore.getState().__setMinPrice(price);
export const setMaxPrice = (price: number) =>
  filterStore.getState().__setMaxPrice(price);
