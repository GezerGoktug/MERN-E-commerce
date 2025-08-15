import { Link } from "react-router-dom";
import { ProductType } from "../../../types/types";
import styles from "./ProductItem.module.scss";
import { motion, Variants } from "framer-motion";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../utils/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { isAccess } from "../../../store/auth/hooks";

const addFav = (_id: string) => api.post('/product/favourites/add', {
  productId: _id
})

const removeFav = (_id: string) => api.delete(`/product/favourites/${_id}`);

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
  const [isFav, setIsFav] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsFav(product.isFav);
  }, [product.isFav])

  useEffect(() => {
    if (!isAccess()) {
      setIsFav(false)
    }
  }, [isAccess()])


  const mutation = useMutation({
    mutationFn: () => isFav ? removeFav(product._id) : addFav(product._id),
    onSuccess: async (data) => {
      toast.success(data.data.message);
      setIsFav(!isFav);
      await queryClient.invalidateQueries({ queryKey: ['favProductCount'] })
      await queryClient.invalidateQueries({ queryKey: ['favProducts'] })
    },
    onError: (error) => {
      setIsFav(!isFav)
      const apiError = error?.response?.data?.error.errorMessage;
      if (typeof apiError === "string") toast.error(apiError);
    }
  })
  const toggleFavourite = () => isAccess() ? mutation.mutate() : null;

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
