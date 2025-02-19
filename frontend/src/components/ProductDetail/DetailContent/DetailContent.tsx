import { IoIosStar } from "react-icons/io";
import Button from "../../ui/Button/Button";
import styles from "./DetailContent.module.scss";
import clsx from "clsx";
import { useState } from "react";
import { ProductDetailContentType, SizeType } from "../../../types/types";
import { createRatingArray } from "../../../helper/createRatingArray";
import { addProductOfCart } from "../../../store/cart/actions";
import toast from "react-hot-toast";

const getSize = (size: string) => {
  switch (size) {
    case "SMALL":
      return "S";
    case "MEDIUM":
      return "M";
    case "LARGE":
      return "L";
    case "XLARGE":
      return "XL";
    case "XXLARGE":
      return "XXL";
    default:
      return "S";
  }
};

const DetailContent = ({
  productDetail,
}: {
  productDetail: ProductDetailContentType;
}) => {
  const [selectedSize, setSelectedSize] = useState<SizeType | null>(null);

  const handleAddCart = () => {
    if (selectedSize === null) {
      toast.error("Please select a size for product.");
      return;
    }
    addProductOfCart({
      _id: productDetail._id,
      size: selectedSize,
      price: productDetail.price,
      name: productDetail.name,
      image: productDetail.image,
    });
    toast.success("Added product to successfully of cart");
  };

  return (
    <div className={styles.product_detail}>
      <h4 className={styles.product_detail_title}>{productDetail.name}</h4>
      <div className={styles.product_detail_rating}>
        <div className={styles.product_detail_stars}>
          {createRatingArray(Math.floor(productDetail.totalRating)).map(
            (rating, i) => (
              <IoIosStar
                key={"product_detail_rating" + i}
                size={18}
                className={clsx(styles.product_detail_star_icon, {
                  [styles.starred]: rating,
                })}
              />
            )
          )}
        </div>
        <span>({productDetail.reviewsCount})</span>
      </div>
      <div className={styles.product_detail_price}>${productDetail.price}</div>
      <p className={styles.product_detail_desc}>
          {productDetail.description}
      </p>

      <div className={styles.product_detail_select_size}>
        <div className={styles.product_detail_select_size_title}>
          Select Size
        </div>
        <div className={styles.product_detail_sizes}>
          {productDetail.sizes.map((size, i) => (
            <div
              key={"product_detail_size_" + i}
              className={clsx({
                [styles.selected]: selectedSize === size,
              })}
              onClick={() => setSelectedSize(size as SizeType)}
            >
              {getSize(size)}
            </div>
          ))}
        </div>
      </div>
      <Button onClick={() => handleAddCart()}>ADD TO CART</Button>
      <div className={styles.product_detail_short_features}>
        <ul>
          <li>100% Original product.</li>
          <li>Cash on delivery is available on this product.</li>
          <li>Easy return and exchange policy within 7 days.</li>
        </ul>
      </div>
    </div>
  );
};

export default DetailContent;
