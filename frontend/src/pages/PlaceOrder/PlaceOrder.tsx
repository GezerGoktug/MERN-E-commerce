import { FormProvider, useForm } from "react-hook-form";
import DeliveryInfoForm from "../../components/PlaceOrder/DeliveryInfoForm/DeliveryInfoForm";
import OrdersDetail from "../../components/PlaceOrder/OrdersDetail/OrdersDetail";
import styles from "./PlaceOrder.module.scss";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAccess } from "../../store/auth/hooks";
import toast from "react-hot-toast";
import { useCart } from "../../store/cart/hooks";
import api from "../../utils/api";
import { loadStripe } from "@stripe/stripe-js";
import { AxiosError } from "axios";
import { clearCart } from "../../store/cart/actions";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const schema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters long"),
  lastName: z.string().min(3, "Last name must be at least 3 characters long"),
  email: z.string().email("İnvalid email"),
  street: z.string().min(3, "Street must be at least 3 characters long"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  phoneNumber: z
    .string()
    .regex(
      /^0 \(\d{3}\) \d{3} \d{2} \d{2}$/,
      "Phone number must be '0 (999) 999 99 99' format."
    ),
  paymentMethod: z
    .enum(["CASH_ON_DELIVERY", "STRIPE"], {
      errorMap: () => ({ message: "Please select a valid payment method." }),
    })
    .default("CASH_ON_DELIVERY"),
});

const PlaceOrder = () => {
  const cart = useCart();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phoneNumber: "",
      paymentMethod: "CASH_ON_DELIVERY",
    },
  });
  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!isAccess()) {
      toast.error("You must log in to make payment.");
      return;
    }
    if (cart.length === 0) {
      toast.error(
        "You must add a few product to your cart ,before go to payment."
      );
      return;
    }

    const body = {
      products: cart,
      cargoFee: 10,
      delivery_info: data,
    };

    try {
      if (data.paymentMethod === "CASH_ON_DELIVERY") {
        const res = await api.post("/order/add", body);

        toast.success(res.data.message);

        form.reset();

        clearCart();

        navigate("/profile");

        return;
      }
      const stripe = await loadStripe(
        import.meta.env.VITE_REACT_STRIPE_PUBLISHABLE_KEY
      );

      const res = await api.post("/payment", body);

      const result = await stripe?.redirectToCheckout({
        sessionId: res?.data.sessionId,
      });

      if (result?.error) {
        toast.error(result.error.message as string);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.error.errorMessage || "Something went wrong."
        );
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <FormProvider {...form}>
      <Helmet>
        <title>Place Order - Forever</title>
        <meta
          name="description"
          content="Complete your order securely on Forever. Buy digital products, software, and AI tools with confidence."
        />
      </Helmet>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={styles.place_order_wrapper}>
          <DeliveryInfoForm />
          <OrdersDetail />
        </div>
      </form>
    </FormProvider>
  );
};

export default PlaceOrder;
