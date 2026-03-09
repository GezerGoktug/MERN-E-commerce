import { Helmet } from "react-helmet";
import { lazy, Suspense } from "react";
import { Loading } from "@forever/ui-kit";

const PlaceOrderWrapper = lazy(
  () => import("../../components/PlaceOrder/PlaceOrderWrapper/PlaceOrderWrapper")
);

const PlaceOrder = () => {
  return (
    <>
      <Helmet>
        <title>Place Order - Forever</title>
        <meta
          name="description"
          content="Complete your order securely on Forever. Buy digital products, software, and AI tools with confidence."
        />
      </Helmet>
      <Suspense fallback={<Loading />}>
        <PlaceOrderWrapper />
      </Suspense>
    </>
  );
};

export default PlaceOrder;
