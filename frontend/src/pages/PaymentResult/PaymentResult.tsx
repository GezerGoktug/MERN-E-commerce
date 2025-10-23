import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import styles from "./PaymentResult.module.scss";
import Button from "../../components/ui/Button/Button";
import { FaCircleUser } from "react-icons/fa6";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { IoCartOutline } from "react-icons/io5";
import { clearCart } from "../../store/cart/actions";
import { Helmet } from "react-helmet";
import { useConfirmOrderPaymentMutation, useDeleteOrderMutation } from "../../services/hooks/mutations/order.mutations";

const PaymentResult = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { mutate: confirmOrderMutation } = useConfirmOrderPaymentMutation({
    onSuccess: (data) => {
      clearCart();
      toast.success(data.data.message);
      const params = new URLSearchParams(searchParams);
      params.delete("orderId");
      params.delete("sessionId");
      setSearchParams(params);
    },
    onError(error) {
      const apiError = error.response?.data.error.errorMessage;
      if (typeof apiError === "string") {
        toast.error(apiError);
      }
    },
  });
  const { mutate: deleteOrderMutation } = useDeleteOrderMutation();

  const isSuccess = searchParams.get("isSuccess") && Number(searchParams.get("isSuccess"));

  useEffect(() => {
    if (searchParams.get("sessionId") && searchParams.get("orderId")) {
      if (isSuccess) {
        confirmOrderMutation({ orderId: searchParams.get("orderId") as string, isPayment: true, sessionId: searchParams.get("sessionId") as string });
      } else if (!isSuccess) {
        deleteOrderMutation(searchParams.get("orderId") as string);
      }
    }
  }, [searchParams, isSuccess]);

  useEffect(() => {
    if (!searchParams.get("sessionId"))
      navigate("/");
    
  }, [searchParams, navigate])


  if(!searchParams.get("sessionId"))
    return null;

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
