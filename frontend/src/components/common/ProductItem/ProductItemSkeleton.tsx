import styles from "./ProductItemSkeleton.module.scss";

const ProductItemSkeleton = ({ item }: { item: number }) => {
  return (
    <div
      key={"product_skeleton" + item}
      className={styles.product_card_skeleton}
    >
      <div className={styles.product_skeleton_image} />
      <div className={styles.product_skeleton_content}>
        <div className={styles.product_skeleton_title} />
        <div className={styles.product_skeleton_price} />
      </div>
    </div>
  );
};

export default ProductItemSkeleton;
