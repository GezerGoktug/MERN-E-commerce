
import styles from "./RelatedProducts.module.scss";
import { ProductType } from "../../../types/types";
import ProductItemSkeleton from "../../common/ProductItem/ProductItemSkeleton";
import ProductCard from "../../common/ProductItem/ProductItem";
import { useQuery } from "@tanstack/react-query";
import { isAccess } from "../../../store/auth/hooks";
import api from "../../../utils/api";

const RelatedProducts = ({
  products = [],
  isPending,
}: {
  products: ProductType[];
  isPending: boolean;
}) => {

  const { data: favProductInfo } = useQuery<{ data: { _id: string, isFav: boolean }[] }>({
    queryKey: ['isRelatedProductInFavProduct', products.map(p => p._id).toString()],
    queryFn: () => api.post("/product/favourites/isProductInFav", {
      productIds: products.map(item => item._id)
    }),
    enabled: (!!products.length && isAccess())
  });

  const isFavProduct = (_id: string) => favProductInfo?.data.find(dt => dt._id === _id)?.isFav || false
  return (
    <div className={styles.related_products}>
      <div className={styles.related_products_top}>
        <h6 className={styles.related_products_title}>
          RELATED
          <span> PRODUCTS</span>
        </h6>
      </div>
      <div className={styles.related_products_products}>
        {isPending ? (
          <>
            {[0, 1, 2, 3, 4].map((item) => (
              <ProductItemSkeleton key={'related_product_skeleton_' + item} />
            ))}
          </>
        ) : (
          <>
            {products.map((item, i) => (
              <ProductCard
                key={"product" + i}
                product={{ ...item, isFav: isFavProduct(item._id) }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
