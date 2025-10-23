import { Response } from "express";
import { CartProductType, ExtendedRequest } from "../types/types";
import { Order } from "../models/Order.schema";
import { deliveryInfoSchema } from "../validations/schema";
import ResponseHandler from "../util/response";
import { JwtPayload } from "jsonwebtoken";
import { ErrorHandler } from "../error/errorHandler";
import { sendOrderMail } from "./mail.controller";
import { stripe } from "../config/stripe";

export const confirmOrderPayment = async (req: ExtendedRequest, res: Response) => {
  const { payment, sessionId } = req.body;
  const orderId = req.params.id;

  if (!sessionId) {
    throw new ErrorHandler(400, "Session id not found");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {
    const isOrderPayment = await Order.findById(orderId).populate("payment");

    if (!isOrderPayment?.payment) {
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          payment: payment,
        },
        {
          new: true,
        }
      );

      await sendOrderMail(
        {
          products: order?.products,
          delivery_info: {
            phoneNumber: order?.phoneNumber,
            emailAdress: order?.emailAddress,
            firstName: order?.firstName,
            lastName: order?.lastName,
            ...order?.locationInfo,
          },
          totalPrice: order?.totalPrice,
        },
        order?.emailAddress as string,
        true
      );
      ResponseHandler.success(res, 200, { message: "Order update success" });
    }
    else {
      throw new ErrorHandler(400, "This order has already been paid for")
    }
  }
  else {
    throw new ErrorHandler(400, "This order has not been paid for.")
  }
};

export const createOrder = async (body: any) => {
  const { delivery_info, products, userId, cargoFee } = body;

  const validated = deliveryInfoSchema.safeParse(delivery_info);

  if (!validated.success) {
    return {
      error: validated.error.flatten().fieldErrors,
      status: 400,
      success: false,
    };
  }

  try {
    const totalPrice = products.reduce(
      (acc: number, product: CartProductType) =>
        acc + product.price * product.quantity,
      0
    );
    const newOrder = new Order({
      firstName: delivery_info.firstName,
      lastName: delivery_info.lastName,
      emailAddress: delivery_info.email,
      locationInfo: {
        city: delivery_info.city,
        country: delivery_info.country,
        state: delivery_info.state,
        street: delivery_info.street,
        zipCode: delivery_info.zipCode,
      },
      payment: false,
      paymentMethod: delivery_info.paymentMethod,
      totalPrice: Math.round(totalPrice + cargoFee),
      phoneNumber: delivery_info.phoneNumber,
      user: userId,
      products: products.map(({ _id, ...product }: { _id: any }) => ({
        ...product,
        product: _id,
      })),
    });

    await newOrder.save();

    if (delivery_info.paymentMethod === "CASH_ON_DELIVERY") {
      await sendOrderMail(
        {
          products: products,
          delivery_info: {
            phoneNumber: delivery_info?.phoneNumber,
            emailAddress: delivery_info?.email,
            firstName: delivery_info.firstName,
            lastName: delivery_info.lastName,
            street: delivery_info.street,
            city: delivery_info.city,
            state: delivery_info.state,
            zipCode: delivery_info.zipCode,
            country: delivery_info.country,
          },
          totalPrice: totalPrice,
        },
        delivery_info.email,
        false
      );
    }

    return {
      message: "Create order success",
      orderId: newOrder._id,
      success: true,
      status: 200,
    };
  } catch (error) {
    return { error: "Create order failed", success: false, status: 500 };
  }
};

export const createOrderRoute = async (req: ExtendedRequest, res: Response) => {
  const { delivery_info, products, cargoFee } = req.body;
  const body = {
    delivery_info,
    userId: (req.user as JwtPayload).userId,
    products,
    cargoFee,
  };
  const response = await createOrder(body);

  if (!response.success)
    throw new ErrorHandler(response.status, response.error as string);

  ResponseHandler.success(res, 200, { message: "Create order successfully" });
};

export const deleteOrder = async (req: ExtendedRequest, res: Response) => {
  const orderId = req.params.id;

  await Order.findByIdAndDelete(orderId);
  ResponseHandler.success(res, 200, { message: "Order delete success" });
};

export const getMyOrder = async (req: ExtendedRequest, res: Response) => {
  const userId = (req?.user as JwtPayload).userId;

  const myOrders = await Order.find({
    user: userId,
  })
    .sort({ createdAt: -1 });

  ResponseHandler.success(res, 200, myOrders);
};

export const getAllOrders = async (req: ExtendedRequest, res: Response) => {
  const allOrders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("user", "name image email");

  ResponseHandler.success(res, 200, allOrders);
};
