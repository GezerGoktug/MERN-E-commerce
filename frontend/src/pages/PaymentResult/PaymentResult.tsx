import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import styles from "./PaymentResult.module.scss";
import Button from "../../components/ui/Button/Button";
import { FaCircleUser } from "react-icons/fa6";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { IoCartOutline } from "react-icons/io5";
import { clearCart } from "../../store/cart/actions";
import { Helmet } from "react-helmet";

const confirmOrder = async (orderId: string, payment: boolean) => {
  const data = await api.put(`/order/${orderId}`, { payment });
  toast.success(data.data.message);
};

const deleteOrder = async (orderId: string) => {
  await api.delete(`/order/${orderId}`);
};

const PaymentResult = () => {
  const searchParams = useSearchParams();

  const isSuccess =
    searchParams[0]?.get("isSuccess") &&
    searchParams[0]?.get("isSuccess") === "true";

  useEffect(() => {
    if (searchParams[0].get("orderId") && isSuccess) {
      confirmOrder(searchParams[0].get("orderId") as string, true);
      clearCart();
    } else {
      deleteOrder(searchParams[0].get("orderId") as string);
    }
  }, [searchParams, isSuccess]);

  return (
    <div className={styles.payment_result_wrapper}>
      <Helmet>
        <title>{isSuccess ? "Success Payment" : "Cancel Payment"} - Forever</title>
      </Helmet>
      {isSuccess ? (
        <AiFillCheckCircle fill="green" size={120} />
      ) : (
        <AiFillCloseCircle fill="red" size={120} />
      )}

      <h6 className={styles.payment_result_title}>
        {isSuccess ? "Payment Successfully" : "Payment failed"}
      </h6>
      <p className={styles.payment_result_content}>
        {isSuccess
          ? "Your order request has been created. You can view your orders from the My Profile page."
          : "The order process failed. Please return to the order page to try again."}
      </p>
      {isSuccess ? (
        <Link to="/profile">
          <Button size="md" rightIcon={FaCircleUser} rightIconSize={20}>
            PROFILE
          </Button>
        </Link>
      ) : (
        <Link to="/cart">
          <Button size="md" rightIcon={IoCartOutline} rightIconSize={20}>
            CART
          </Button>
        </Link>
      )}
    </div>
  );
};

export default PaymentResult;
