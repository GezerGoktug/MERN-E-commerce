import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button } from "@forever/ui-kit";
import { getStripe } from "../../../../infrastructure/stripe/stripe.service";
import styles from "./StripePaymentForm.module.scss";

interface PaymentFormInnerProps {
  orderId: string;
  onError: (msg: string) => void;
}

const PaymentFormInner = ({ orderId, onError }: PaymentFormInnerProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/result?orderId=${orderId}`,
      },
    });

    if (error) {
      const message =
        error.type === "card_error"
          ? error.message ?? "Your card was declined. Please try a different card."
          : error.type === "validation_error"
          ? error.message ?? "Please review your payment details and try again."
          : "Payment could not be processed. Please try again or contact support.";
      onError(message);
      setIsLoading(false);
    }
    // On success Stripe redirects; no further action needed here.
  };

  return (
    <form onSubmit={handleSubmit} className={styles.stripe_form}>
      <PaymentElement />
      <Button
        type="submit"
        loading={isLoading}
        className={styles.stripe_pay_btn}
      >
        PAY NOW
      </Button>
    </form>
  );
};

interface StripePaymentFormProps {
  clientSecret: string;
  orderId: string;
  onBack: () => void;
  onError: (msg: string) => void;
}

const StripePaymentForm = ({
  clientSecret,
  orderId,
  onBack,
  onError,
}: StripePaymentFormProps) => {
  const stripePromise = getStripe();

  return (
    <div className={styles.stripe_payment_wrapper}>
      <button type="button" className={styles.stripe_back_btn} onClick={onBack}>
        ← Back
      </button>
      <h4 className={styles.stripe_title}>
        SECURE <span>PAYMENT</span>
      </h4>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentFormInner orderId={orderId} onError={onError} />
      </Elements>
    </div>
  );
};

export default StripePaymentForm;
