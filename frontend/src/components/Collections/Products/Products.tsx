import { useQuery } from "@tanstack/react-query";
import { IPaginationResult, ProductType } from "../../../types/types";
import styles from "./Products.module.scss";
import api from "../../../utils/api";
import { useEffect, useState } from "react";
import {
  useCategories,
  useMinPrice,
  usePage,
  useSearchQuery,
  useSubCategories,
} from "../../../store/filter/hooks";
import { setMaxPrice, setPageCount } from "../../../store/filter/actions";
import ProductCard from "../../common/ProductItem/ProductItem";
import ProductItemSkeleton from "../../common/ProductItem/ProductItemSkeleton";

type SortType = "DEFAULT" | "LOW_TO_HIGH" | "HIGH_TO_LOW";

const generateSortingType = (sort: SortType) => {
  switch (sort) {
    case "DEFAULT":
      return { type: "default", field: null };
    case "HIGH_TO_LOW":
      return { type: "desc", field: "price" };
    case "LOW_TO_HIGH":
      return { type: "asc", field: "price" };
    default:
      return { type: "default", field: null };
  }
};

const Products = () => {
  const [sorting, setSorting] = useState<SortType>("DEFAULT");
  const page = usePage();
  const categories = useCategories();
  const subCategories = useSubCategories();
  const searchQuery = useSearchQuery();
  const minPrice = useMinPrice();

  const { data, isPending } = useQuery<{
    data: IPaginationResult<ProductType, { maxPrice: number }>;
  }>({
    queryKey: [
      "products",
      sorting,
      page,
      categories,
      subCategories,
      searchQuery,
      minPrice,
    ],
    queryFn: () => {
      const categoriesUrl = categories
        .map((item) => {
          return `categories=${item}&`;
        })
        .join("");

      const subCategoriesUrl = subCategories
        .map((item) => {
          return `subCategory=${item}&`;
        })
        .join("");

      const searchQueryUrl =
        searchQuery.trim().length < 3 ? "" : `&searchQuery=${searchQuery}`;

      const sortProps = generateSortingType(sorting);
      const sortUrl =
        "&" +
        (sortProps.field ? `sortField=${sortProps.field}&` : "") +
        `sortType=${sortProps.type}`;

      return api.get(
        `/product/list?${categoriesUrl}${subCategoriesUrl}page=${page}&pageSize=15${sortUrl}${searchQueryUrl}&minPrice=${minPrice}`
      );
    },
  });

  useEffect(() => {
    if (data && data.data.otherData) {
      setPageCount(data?.data.totalPage);
      setMaxPrice(data.data.otherData?.maxPrice);
    }
  }, [data]);

  return (
    <div className={styles.product_wrapper}>
      <div className={styles.product_header}>
        <h5>
          ALL <span>COLLECTIONS</span>
        </h5>

        <select
          onChange={(e) => setSorting(e.target.value as SortType)}
          className={styles.product_sort_select}
          name="sorting_products"
        >
          <option value="DEFAULT">Sort by: Relavent</option>
          <option value="LOW_TO_HIGH">Sort by: Low to High</option>
          <option value="HIGH_TO_LOW">Sort by: High to Low</option>
        </select>
      </div>
      <div className={styles.products}>
        {isPending ? (
          <>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item) => (
              <ProductItemSkeleton item={item} />
            ))}
          </>
        ) : (
          <>
            {data?.data?.content.map((item, i) => (
              <ProductCard key={"product" + i} product={item} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
