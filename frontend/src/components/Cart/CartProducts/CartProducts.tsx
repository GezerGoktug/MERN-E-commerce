import { GrTrash } from "react-icons/gr";
import Input from "../../ui/Input/Input";
import styles from "./CartProducts.module.scss";
import { useCart } from "../../../store/cart/hooks";
import {
  applyQuantityToProduct,
  removeProductOfCart,
} from "../../../store/cart/actions";
import getSize from "../../../helper/getSize";

const CartProducts = () => {
  const cart = useCart();

  return (
    <div className={styles.cart_wrapper}>
      <h5>
        YOUR <span>CART</span>
      </h5>
      <div className={styles.cart_product_list}>
        {cart.map((item) => (
          <div
            key={`${item._id}_${item.size}`}
            className={styles.cart_product_item}
          >
            <img src={item.image} alt="" />
            <div className={styles.cart_product_item_content}>
              <h6>{item.name}</h6>
              <div className={styles.cart_product_price_and_size}>
                <span>${item.price}</span>
                <div>{getSize(item.size)}</div>
              </div>
            </div>
            <div className={styles.cart_product_item_quantity}>
              <Input
                className={styles.cart_product_item_quantity_input}
                type="number"
                min={1}
                max={20}
                onChange={(e) =>
                  applyQuantityToProduct(+e.target.value, item._id, item.size)
                }
                defaultValue={item.quantity}
              />
            </div>
            <GrTrash
              onClick={() => removeProductOfCart(item._id, item.size)}
              className={styles.cart_product_item_trash_icon}
              size={25}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartProducts;
