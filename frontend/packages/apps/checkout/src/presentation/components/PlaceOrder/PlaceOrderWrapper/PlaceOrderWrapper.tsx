import { FormProvider, useForm } from "react-hook-form";
import styles from "./PlaceOrderWrapper.module.scss";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useState, lazy, Suspense } from "react";
import { useCart } from "../../../../application/store/cart/hooks";
import { useCreateOrderWithCashOnDeliveryPaymentMethodMutation, useCreateStripePaymentIntentMutation } from "../../../../application/use-cases/order.use-cases";
import { clearCart } from "../../../../application/store/cart/actions";
import { isAccess } from "../../../../application/store/auth/hooks";
import DeliveryInfoForm from "../DeliveryInfoForm/DeliveryInfoForm";
import OrdersDetail from "../OrdersDetail/OrdersDetail";
import { Loading } from "@forever/ui-kit";

const StripePaymentForm = lazy(() => import("../StripePaymentForm/StripePaymentForm"));

const schema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters long"),
  lastName: z.string().min(3, "Last name must be at least 3 characters long"),
  email: z.string().email("Invalid email"),
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

type FormValues = z.infer<typeof schema>;

interface StripeStep {
  clientSecret: string;
  orderId: string;
}

const PlaceOrderWrapper = () => {
  const cart = useCart();
  const navigate = useNavigate();
  const [stripeStep, setStripeStep] = useState<StripeStep | null>(null);

  const form = useForm<FormValues>({
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

  const { mutateAsync: createOrderWithCashOnDelivery } =
    useCreateOrderWithCashOnDeliveryPaymentMethodMutation({
      onSuccess(data) {
        toast.success(data.data.message);
        form.reset();
        clearCart();
        navigate("/profile");
      },
    });

  const { mutateAsync: createStripePaymentIntent } =
    useCreateStripePaymentIntentMutation();

  const onSubmit = async (data: FormValues) => {
    if (!isAccess()) {
      toast.error("You must log in to make payment.");
      return;
    }
    if (cart.length === 0) {
      toast.error(
        "You must add a few products to your cart before going to payment."
      );
      return;
    }

    const body = { products: cart, cargoFee: 10, delivery_info: data };

    try {
      if (data.paymentMethod === "CASH_ON_DELIVERY") {
        await createOrderWithCashOnDelivery(body);
      } else {
        const result = await createStripePaymentIntent(body);
        setStripeStep({
          clientSecret: result.data.clientSecret,
          orderId: result.data.orderId,
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const apiError = error?.response?.data?.error.errorMessage;
        if (typeof apiError === "string") toast.error(apiError);
        if (apiError && typeof apiError === "object") {
          Object.entries(apiError).forEach(([key, value]) => {
            (value as string[]).forEach((val) => toast.error(`${key} : ${val}`));
          });
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  if (stripeStep) {
    return (
      <Suspense fallback={<Loading />}>
        <StripePaymentForm
          clientSecret={stripeStep.clientSecret}
          orderId={stripeStep.orderId}
          onBack={() => setStripeStep(null)}
          onError={(msg) => toast.error(msg)}
        />
      </Suspense>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={styles.place_order_wrapper}>
          <DeliveryInfoForm />
          <OrdersDetail />
        </div>
      </form>
    </FormProvider>
  );
};

export default PlaceOrderWrapper;
