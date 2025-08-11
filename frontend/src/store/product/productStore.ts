import { create } from "zustand";

type Store = {
  pageCount: number;
  maxPrice: number;
  __setPageCount: (pageCount: number) => void;
  __setMaxPrice: (price: number) => void;
};

const productStore = create<Store>()((set) => ({
  pageCount: 1,
  maxPrice: 2000,
  __setPageCount: (pageCount) =>
    set((state) => {
      return {
        ...state,
        pageCount: pageCount,
      };
    }),
  __setMaxPrice: (price) =>
    set((state) => {
      return {
        ...state,
        maxPrice: price,
      };
    }),
}));

export default productStore;
