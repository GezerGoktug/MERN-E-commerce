import { Link } from "react-router-dom";
import { ProductType } from "../../../types/types";
import styles from "./ProductItem.module.scss";
import { motion, Variants } from "framer-motion";

const variant = {
  open: { y: 0, opacity: 1 },
  close: { y: 120, opacity: 0 },
};

const ProductCard = ({
  product,
  animationVariant = variant,
  customIndex = 0,
  useWhileInView = false,
}: {
  product: ProductType;
  animationVariant?: Variants;
  customIndex?: number;
  useWhileInView?: boolean;
}) => {
  return (
    <Link to={`/product/${product._id}`}>
      <motion.div
        variants={animationVariant}
        initial="close"
        {...(useWhileInView ? { whileInView: "open" } : { animate: "open" })}
        transition={{ duration: 0.5, delay: 0.1 * customIndex }}
        viewport={{ once: true }}
        className={styles.product_card}
      >
        <div className={styles.product_card_img}>
          <img src={product.image} alt={product.name} />
        </div>
        <h4>{product.name}</h4>
        <span>${product.price}</span>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
