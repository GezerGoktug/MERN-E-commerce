import useProductStore from "./productStore";

export const usePageCount = () => useProductStore((state) => state.pageCount);
export const useMaxPrice = () => useProductStore((state) => state.maxPrice);
