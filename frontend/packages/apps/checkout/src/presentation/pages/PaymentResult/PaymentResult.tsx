import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import styles from "./PaymentResult.module.scss";
import { FaCircleUser } from "react-icons/fa6";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { IoCartOutline } from "react-icons/io5";
import { clearCart } from "../../../application/store/cart/actions";
import { Helmet } from "react-helmet";
import {
  useConfirmOrderPaymentMutation,
  useDeleteOrderMutation,
} from "../../../application/use-cases/order.use-cases";
import { Button } from "@forever/ui-kit";

const PaymentResult = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { mutate: confirmOrderMutation } = useConfirmOrderPaymentMutation({
    onSuccess: (data) => {
      clearCart();
      toast.success(data.data.message);
      const params = new URLSearchParams(searchParams);
      params.delete("orderId");
      params.delete("payment_intent");
      params.delete("payment_intent_client_secret");
      params.delete("redirect_status");
      setSearchParams(params);
    },
    onError(error) {
      const apiError = error.response?.data.error.errorMessage;
      if (typeof apiError === "string") toast.error(apiError);
    },
  });

  const { mutate: deleteOrderMutation } = useDeleteOrderMutation();

  // Stripe Payment Element sets redirect_status; legacy flow uses isSuccess param.
  const redirectStatus = searchParams.get("redirect_status");
  const isSuccessParam = searchParams.get("isSuccess");
  const isSuccess = redirectStatus
    ? redirectStatus === "succeeded"
    : Boolean(isSuccessParam && Number(isSuccessParam));

  const paymentIntentId = searchParams.get("payment_intent");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const currentOrderId = searchParams.get("orderId");

    if (!currentOrderId) {
      navigate("/cart");
      return;
    }

    if (isSuccess) {
      confirmOrderMutation({
        orderId: currentOrderId,
        isPayment: true,
        ...(paymentIntentId ? { paymentIntentId } : {}),
      });
    } else {
      deleteOrderMutation(currentOrderId);
    }
  }, []);

  if (!orderId) return null;

  return (
    <div className={styles.payment_result_wrapper}>
      <Helmet>
        <title>
          {isSuccess ? "Success Payment" : "Cancel Payment"} - Forever
        </title>
      </Helmet>
      {isSuccess ? (
        <AiFillCheckCircle fill="green" size={120} />
      ) : (
        <AiFillCloseCircle fill="red" size={120} />
      )}

      <h6 className={styles.payment_result_title}>
        {isSuccess ? "Payment Successfully" : "Payment Failed"}
      </h6>
      <p className={styles.payment_result_content}>
        {isSuccess
          ? "Your order request has been created. You can view your orders from the My Profile page."
          : "The order process failed. Please return to the cart to try again."}
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
