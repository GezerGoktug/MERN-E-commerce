import { useQuery } from "@tanstack/react-query";
import { ProductType } from "../../../types/types";
import styles from "./BestSellers.module.scss";
import api from "../../../utils/api";
import ProductCard from "../../common/ProductItem/ProductItem";
import ProductItemSkeleton from "../../common/ProductItem/ProductItemSkeleton";

const BestSellers = () => {
  const { data, isPending } = useQuery({
    queryKey: ["best-seller-products"],
    queryFn: () => {
      return api.get("/product/best-seller-products/list");
    },
  });

  return (
    <div className={styles.best_sellers}>
      <div className={styles.best_sellers_top}>
        <h6 className={styles.best_sellers_title}>
          BEST
          <span> SELLERS</span>
        </h6>
        <p className={styles.best_sellers_description}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the.
        </p>
      </div>
      <div className={styles.best_sellers_products}>
        {isPending ? (
          <>
            {[0, 1, 2, 3, 4].map((item, i) => (
              <ProductItemSkeleton
                key={"best_sellers_collection_skeleton_" + i}
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
                key={"best_sellers_collection_" + item._id}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default BestSellers;
