import { ProductType } from "../../../types/product.type";
import styles from "./LatestCollections.module.scss";
import ProductItemSkeleton from "../../common/ProductItem/ProductItemSkeleton";
import ProductCard from "../../common/ProductItem/ProductItem";
import { isAccess } from "../../../store/auth/hooks";
import { useGetLatestProductsQuery, useIsProductsInFavQuery } from "../../../services/hooks/queries/product.query";

const LatestCollections = () => {
  const { data, isPending } = useGetLatestProductsQuery();

  const { data: favProductInfo } = useIsProductsInFavQuery(
    data?.data?.map(p => p._id) || [],
    ["isLatestProductInFavProduct"],
    {
      enabled: (!!data?.data?.length && isAccess())
    }
  )

  const isFavProduct = (_id: string) => favProductInfo?.data.find(dt => dt._id === _id)?.isFav || false

  return (
    <div className={styles.latest_collections}>
      <div className={styles.latest_collections_top}>
        <h6 className={styles.latest_collections_title}>
          LATEST
          <span> COLLECTIONS</span>
        </h6>
        <p className={styles.latest_collections_description}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the.
        </p>
      </div>
      <div className={styles.latest_collections_products}>
        {isPending ? (
          <>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <ProductItemSkeleton
                key={"latest_collection_skeleton_" + item}
              />
            ))}
          </>
        ) : (
          <>
            {data?.data.map((item: ProductType, i: number) => (
              <ProductCard
                useWhileInView
                product={{ ...item, isFav: isFavProduct(item._id) }}
                customIndex={i}
                key={"latest_collection_" + item._id}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default LatestCollections;
