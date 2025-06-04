import useFilterStore from "./filterStore";

export const useCategories = () => useFilterStore((state) => state.categories);
export const usePage = () => useFilterStore((state) => state.page);
export const usePageCount = () => useFilterStore((state) => state.pageCount);
export const useSubCategories = () =>
  useFilterStore((state) => state.subCategories);
export const useSearchQuery = () =>
  useFilterStore((state) => state.searchQuery);
export const useMinPrice = () => useFilterStore((state) => state.minPrice);
export const useMaxPrice = () => useFilterStore((state) => state.maxPrice);
