import { motion } from "framer-motion";
import styles from "./RelatedProducts.module.scss";
import { Link } from "react-router-dom";
import { ProductType } from "../../../types/types";

const RelatedProductCard = ({
  product,
  index,
}: {
  product: ProductType;
  index: number;
}) => {
  return (
    <Link to={`/product/${product._id}`}>
      <motion.div
        whileInView={{ y: 0, opacity: 1 }}
        initial={{ y: 120, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.1 * (index + 2) }}
        viewport={{ once: true }}
        className={styles.product_card}
      >
        <div className={styles.product_card_img}>
          <img src={product.image} alt="" />
        </div>
        <h4>{product.name}</h4>
        <span>${product.price}</span>
      </motion.div>
    </Link>
  );
};

const RelatedProducts = ({
  products,
  isPending,
}: {
  products: ProductType[];
  isPending: boolean;
}) => {
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
              <div
                key={"related_product_skeleton" + item}
                className={styles.product_card_skeleton}
              >
                <div className={styles.product_skeleton_image} />
                <div className={styles.product_skeleton_content}>
                  <div className={styles.product_skeleton_title} />
                  <div className={styles.product_skeleton_price} />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {products.map((item, i) => (
              <RelatedProductCard product={item} index={i} key={item._id} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
