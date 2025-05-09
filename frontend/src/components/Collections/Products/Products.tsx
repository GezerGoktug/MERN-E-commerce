import { useQuery } from "@tanstack/react-query";
import { IPaginationResult, ProductType } from "../../../types/types";
import styles from "./Products.module.scss";
import api from "../../../utils/api";
import { useEffect, useState } from "react";
import {
  useCategories,
  usePage,
  useSearchQuery,
  useSubCategories,
} from "../../../store/filter/hooks";
import { setPageCount } from "../../../store/filter/actions";
import ProductCard from "../../common/ProductItem/ProductItem";
import ProductItemSkeleton from "../../common/ProductItem/ProductItemSkeleton";

const Products = () => {
  const [sorting, setSorting] = useState("DEFAULT");
  const page = usePage();
  const categories = useCategories();
  const subCategories = useSubCategories();
  const searchQuery = useSearchQuery();

  const { data, isPending } = useQuery<{
    data: IPaginationResult<ProductType>;
  }>({
    queryKey: [
      "products",
      sorting,
      page,
      categories,
      subCategories,
      searchQuery,
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

      return api.get(
        `/product/list?${categoriesUrl}${subCategoriesUrl}page=${page}&sorting=${sorting}${searchQueryUrl}`
      );
    },
  });

  useEffect(() => {
    if (data) {
      setPageCount(data?.data.totalPage);
    }
  }, [data]);

  return (
    <div className={styles.product_wrapper}>
      <div className={styles.product_header}>
        <h5>
          ALL <span>COLLECTIONS</span>
        </h5>

        <select
          onChange={(e) => setSorting(e.target.value)}
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
