import { GoDot, GoDotFill } from "react-icons/go";
import Cash from "../../Cart/Cash/Cash";
import styles from "./OrdersDetail.module.scss";
import Button from "../../ui/Button/Button";
import { useFormContext } from "react-hook-form";

const OrdersDetail = () => {
  const form = useFormContext();

  return (
    <div className={styles.order_detail_wrapper}>
      <Cash isCheckoutButton={false} />
      <div className={styles.payment_method}>
        <h6>
          PAYMENT
          <span>METHOD</span>
        </h6>
        <div className={styles.payment_method_select}>
          <div
            onClick={() => form.setValue("paymentMethod", "STRIPE")}
            className={styles.payment_method_option}
          >
            {form.watch("paymentMethod") === "STRIPE" ? (
              <GoDotFill fill="green" size={25} />
            ) : (
              <GoDot size={25} />
            )}

            <img src="/stripe.png" alt="" />
          </div>
          <div
            onClick={() => form.setValue("paymentMethod", "CASH_ON_DELIVERY")}
            className={styles.payment_method_option}
          >
            {form.watch("paymentMethod") === "CASH_ON_DELIVERY" ? (
              <GoDotFill fill="green" size={25} />
            ) : (
              <GoDot size={25} />
            )}
            <span>CASH ON DELIVERY</span>
          </div>
        </div>
      </div>
      <Button
        loading={form.formState.isSubmitting}
        type="submit"
        className={styles.payment_method_btn}
      >
        PLACE ORDER
      </Button>
    </div>
  );
};

export default OrdersDetail;
