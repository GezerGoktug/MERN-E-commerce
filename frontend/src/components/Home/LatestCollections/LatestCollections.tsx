import { useQuery } from "@tanstack/react-query";
import { ProductType } from "../../../types/types";
import styles from "./LatestCollections.module.scss";
import api from "../../../utils/api";
import ProductItemSkeleton from "../../common/ProductItem/ProductItemSkeleton";
import ProductCard from "../../common/ProductItem/ProductItem";

const LatestCollections = () => {
  const { data, isPending } = useQuery({
    queryKey: ["latest_collections"],
    queryFn: () => {
      return api.get("/product/latest-products/list");
    },
  });

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
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, i) => (
              <ProductItemSkeleton
                key={"latest_collection_skeleton_" + i}
                item={item}
              />
            ))}
          </>
        ) : (
          <>
            {data?.data.map((item: ProductType, i: number) => (
              <ProductCard
                useWhileInView
                product={item}
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
