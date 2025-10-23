import { Response } from "express";
import { CartProductType, ExtendedRequest } from "../types/types";
import dotenv from "dotenv";
import { createOrder } from "./order.controller";
import { JwtPayload } from "jsonwebtoken";
import ResponseHandler from "../util/response";
import { ErrorHandler } from "../error/errorHandler";
import { stripe } from "../config/stripe";

dotenv.config();

export const createPayment = async (req: ExtendedRequest, res: Response) => {
  const { products, cargoFee, delivery_info } = req.body;

  if (products.length === 0)
    throw new ErrorHandler(
      400,
      "You must add a few product to your cart ,before go to payment."
    );

  const lineItems = products.map((product: CartProductType) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
        description: "Size : " + product.size,
        images: [product.image],
        metadata: {
          size: product.size,
        },
      },
      unit_amount: Math.round(product.price * 100),
    },
    quantity: product.quantity,
  }));

  lineItems.push({
    price_data: {
      currency: "usd",
      product_data: {
        name: "Cargo fee",
      },
      unit_amount: Math.round(cargoFee * 100),
    },
    quantity: 1,
  });

  const body = {
    delivery_info,
    userId: (req.user as JwtPayload).userId,
    products,
    cargoFee,
  };
  const response = await createOrder(body);

  if (!response.success)
    throw new ErrorHandler(response.status, response.error as string);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/payment/result?isSuccess=1&sessionId={CHECKOUT_SESSION_ID}&orderId=${response.orderId}`,
    cancel_url: `${process.env.CLIENT_URL}/payment/result?isSuccess=0&sessionId={CHECKOUT_SESSION_ID}&orderId=${response.orderId}`,
  });

  ResponseHandler.success(res, 200, { sessionId: session.id });
};
