import { create } from "zustand";

export type OprType = "ADD" | "DELETE";

type Store = {
  categories: string[];
  subCategories: string[];
  page: number;
  pageCount: number;
  searchQuery: string;
  __setCategory: (category: string, opr: OprType) => void;
  __setSubCategory: (subCategory: string, opr: OprType) => void;
  __nextPage: () => void;
  __prevPage: () => void;
  __setSearchQuery: (query: string) => void;
  __setPageCount: (pageCount: number) => void;
};

const filterStore = create<Store>()((set) => ({
  categories: [],
  subCategories: [],
  page: 0,
  pageCount: 1,
  searchQuery: "",
  __setCategory: (category, opr) =>
    set((state) => {
      if (opr === "DELETE") {
        return {
          ...state,
          categories: state.categories.filter((item) => item !== category),
        };
      } else if (opr === "ADD") {
        return {
          ...state,
          categories: [...state.categories, category],
        };
      }
      return state;
    }),
  __setSubCategory: (subCategory, opr) =>
    set((state) => {
      if (opr === "DELETE") {
        return {
          ...state,
          subCategories: state.subCategories.filter(
            (item) => item !== subCategory
          ),
        };
      } else if (opr === "ADD") {
        return {
          ...state,
          subCategories: [...state.subCategories, subCategory],
        };
      }
      return state;
    }),
  __nextPage: () =>
    set((state) => {
      return {
        ...state,
        page: state.page === state.pageCount - 1 ? state.page : state.page + 1,
      };
    }),
  __prevPage: () =>
    set((state) => {
      return {
        ...state,
        page: state.page === 0 ? state.page : state.page - 1,
      };
    }),
  __setSearchQuery: (query) =>
    set((state) => {
      return {
        ...state,
        searchQuery: query,
      };
    }),
  __setPageCount: (pageCount) =>
    set((state) => {
      return {
        ...state,
        pageCount: pageCount,
      };
    }),
}));

export default filterStore;
