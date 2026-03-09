import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

/** Returns a singleton Stripe instance, lazily loaded. */
export const getStripe = (): Promise<Stripe | null> => {
    const publishableKey = import.meta.env.VITE_REACT_STRIPE_PUBLISHABLE_KEY as string | undefined;

    if (!publishableKey) {
        throw new Error(
            "Missing Stripe publishable key. Set VITE_REACT_STRIPE_PUBLISHABLE_KEY in your environment."
        );
    }

    if (!stripePromise) {
        stripePromise = loadStripe(publishableKey);
    }
    return stripePromise;
};
