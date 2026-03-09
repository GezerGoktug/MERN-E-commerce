import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

/** Returns a singleton Stripe instance, lazily loaded. */
export const getStripe = (): Promise<Stripe | null> => {
    if (!stripePromise) {
        stripePromise = loadStripe(
            import.meta.env.VITE_REACT_STRIPE_PUBLISHABLE_KEY as string
        );
    }
    return stripePromise;
};
