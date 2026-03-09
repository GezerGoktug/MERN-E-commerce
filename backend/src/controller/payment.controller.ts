import { Response } from "express";
import { CartProductType, ExtendedRequest } from "../types/types";
import dotenv from "dotenv";
import { createOrder } from "./order.controller";
import { JwtPayload } from "jsonwebtoken";
import ResponseHandler from "../util/response";
import { ErrorHandler } from "../error/errorHandler";
import { stripe } from "../config/stripe";

dotenv.config();

/**
 * POST /payment/intent
 * Creates a Stripe PaymentIntent and the pending order, returns clientSecret + orderId.
 * The frontend uses @stripe/react-stripe-js to render the Payment Element inline.
 */
export const createPaymentIntent = async (req: ExtendedRequest, res: Response) => {
  const { products, cargoFee, delivery_info } = req.body;

  if (products.length === 0)
    throw new ErrorHandler(
      400,
      "You must add a few products to your cart before going to payment."
    );

  const totalAmount =
    products.reduce(
      (sum: number, p: CartProductType) => sum + p.price * p.quantity,
      0
    ) + cargoFee;

  const body = {
    delivery_info,
    userId: (req.user as JwtPayload).userId,
    products,
    cargoFee,
  };

  const response = await createOrder(body);

  if (!response.success)
    throw new ErrorHandler(response.status, response.error as string);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalAmount * 100),
    currency: "usd",
    metadata: { orderId: String(response.orderId) },
  });

  ResponseHandler.success(res, 200, {
    clientSecret: paymentIntent.client_secret,
    orderId: response.orderId,
  });
};
