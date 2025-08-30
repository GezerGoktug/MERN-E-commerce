import { useQuery } from "@tanstack/react-query";
import { IPaginationResult, ProductSearchQueryType, ProductType } from "../../../types/types";
import styles from "./Products.module.scss";
import api from "../../../utils/api";
import { useEffect } from "react";
import { setMaxPrice, setPagination } from "../../../store/product/actions";
import ProductCard from "../../common/ProductItem/ProductItem";
import ProductItemSkeleton from "../../common/ProductItem/ProductItemSkeleton";
import { useQueryParams } from "../../../hooks/use-query-params";
import { RiMenuSearchLine } from "react-icons/ri";
import Button from "../../ui/Button/Button";
import { GrPowerReset } from "react-icons/gr";
import { isAccess } from "../../../store/auth/hooks";
import { generateSortingType, SortType } from "../../../helper/generateSortingType";
import buildQuery from "../../../utils/queryStringfy";
import DataStateHandler from "../../common/DataStateHandler/DataStateHandler";
import { FaCircleXmark } from "react-icons/fa6";

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

  const { data, isPending, isError, refetch } = useQuery<{
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
    queryFn: async () => {
      const sortProps = generateSortingType(sorting);

      return api.get(
        `/product/list?${buildQuery({
          categories,
          subCategory: subCategories,
          ...(searchQuery.trim().length > 2 && { searchQuery }),
          ...(sortProps.field && { sortField: sortProps.field }),
          sortType: sortProps.type,
          page,
          pageSize: 15,
          minPrice
        })}`
      );
    },
  });

  const { data: favProductInfo } = useQuery<{ data: { _id: string, isFav: boolean }[] }>({
    queryKey: ['isProductInFavProduct', data?.data?.content?.map(p => p._id).toString()],
    queryFn: () => api.post("/product/favourites/isProductInFav", {
      productIds: data!.data.content.map(item => item._id)
    }),
    enabled: (!!data?.data?.content?.length && isAccess())
  });

  useEffect(() => {
    if (data?.data?.otherData) {
      setPagination({
        pageCount: data?.data.totalPage,
        hasNext: data.data.hasNext,
        hasPrev: data.data.hasPrev,
      });
      setMaxPrice(data.data.otherData?.maxPrice);
    }
  }, [data]);

  const isFavProduct = (_id: string) => favProductInfo?.data.find(dt => dt._id === _id)?.isFav || false


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
        <DataStateHandler
          data={data?.data.content}
          isError={isError}
          isLoading={isPending}
          errorFallback={
            <div className={styles.products_error}>
              <FaCircleXmark className={styles.products_error_icon} />
              <div className={styles.products_error_text}>
                <h6>Error</h6>
                <p>
                  We occurred a error while your get products with your desired filters .Please you retry to get products with your desired filters.
                </p>
                <Button
                  className={styles.products_error_btn}
                  rightIcon={GrPowerReset}
                  variant="secondary"
                  onClick={() => refetch()}
                >
                  RETRY
                </Button>
              </div>
            </div>
          }
          loadingFallback={
            <>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item) => (
                <ProductItemSkeleton key={'product_skeleton_item' + item} />
              ))}
            </>
          }
          noContentFallback={
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
          }
        >
          {
            (data) => data.map((item) => (
              <ProductCard
                key={"product" + item._id}
                product={{ ...item, isFav: isFavProduct(item._id) }}
              />
            ))
          }
        </DataStateHandler>
      </div>
    </div>
  );
};

export default Products;
