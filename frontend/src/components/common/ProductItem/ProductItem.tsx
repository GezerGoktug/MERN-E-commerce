import { Link } from "react-router-dom";
import { ProductType } from "../../../types/product.type";
import styles from "./ProductItem.module.scss";
import { motion, Variants } from "framer-motion";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { isAccess } from "../../../store/auth/hooks";
import { useHandleFavouriteMutation } from "../../../services/hooks/mutations/product.mutations";

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
  product: ProductType & { isFav: boolean };
  animationVariant?: Variants;
  customIndex?: number;
  useWhileInView?: boolean;
}) => {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(product.isFav);
  }, [product.isFav])

  useEffect(() => {
    if (!isAccess()) {
      setIsFav(false)
    }
  }, [isAccess()])

  const { mutate } = useHandleFavouriteMutation({
    onSuccess: async (data) => {
      toast.success(data.data.message);
      setIsFav(!isFav);
    },
    onError: (error) => {
      setIsFav(!isFav);
      const apiError = error?.response?.data?.error.errorMessage;
      if (typeof apiError === "string") toast.error(apiError);
    }
  });

  const toggleFavourite = () => isAccess() ? mutate({ isFav, productId: product._id }) : toast.error('Please you login for add product to your favourites');

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
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavourite();
          }}
          className={styles.product_card_fav_icon}>
          {isFav ? <IoMdHeart fill="red" size={20} /> : <IoMdHeartEmpty size={20} />}
        </div>
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
