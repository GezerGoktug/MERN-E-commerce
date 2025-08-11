import { useQuery } from "@tanstack/react-query";
import { IPaginationResult, ProductSearchQueryType, ProductType } from "../../../types/types";
import styles from "./Products.module.scss";
import api from "../../../utils/api";
import { useEffect } from "react";
import { setMaxPrice, setPageCount } from "../../../store/product/actions";
import ProductCard from "../../common/ProductItem/ProductItem";
import ProductItemSkeleton from "../../common/ProductItem/ProductItemSkeleton";
import { useQueryParams } from "../../../hooks/use-query-params";
import { RiMenuSearchLine } from "react-icons/ri";
import Button from "../../ui/Button/Button";
import { GrPowerReset } from "react-icons/gr";

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
  const { queryState, clearQuery, querySetters: { setSorting } } = useQueryParams<Pick<ProductSearchQueryType, 'page' | 'categories' | 'minPrice' | 'searchQuery' | 'subCategories' | 'sorting'>>({
    page: 0,
    categories: [],
    subCategories: [],
    searchQuery: '',
    minPrice: 0,
    sorting: 'DEFAULT'
  })

  const { searchQuery, minPrice, page, categories, subCategories, sorting } = queryState;

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
          value={sorting}
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
              <ProductItemSkeleton key={'product_skeleton_item' + item} item={item} />
            ))}
          </>
        ) : (
          <>
            {
              data?.data?.content.length === 0 ? (
                <div className={styles.products_no_content}>
                  <RiMenuSearchLine className={styles.products_no_content_icon} />
                  <div className={styles.products_no_content_text}>
                    <h6>Not found anything product</h6>
                    <p>
                      We not found anything a product according to your search query.You try to search with different a query
                    </p>
                    <Button
                      className={styles.products_no_content_btn}
                      rightIcon={GrPowerReset}
                      variant="secondary"
                      onClick={() => clearQuery()}
                    >
                      RESET FILTRE
                    </Button>
                  </div>
                </div>
              ) : data?.data?.content.map((item, i) => (
                <ProductCard key={"product" + i} product={item} />
              ))
            }
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
