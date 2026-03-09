import api from "../../utils/api";
import type { IDefaultResponse, IResponse } from "@forever/api";
import type { ICreateOrderVariables, ICreateOrderWithStripeIntentResponse, IOrder } from "../../types/order.type";

const getMyOrders = (): Promise<IResponse<IOrder[]>> => api.get("/order/my-order");

const createOrderWithCashOnDeliveryPaymentMethod = (body: ICreateOrderVariables): Promise<IResponse<IDefaultResponse>> => api.post("/order/add", body)

const createOrderWithStripePaymentMethod = (body: ICreateOrderVariables): Promise<IResponse<ICreateOrderWithStripeIntentResponse>> => api.post("/payment/intent", body)

const confirmOrderPayment = (orderId: string, isPayment: boolean, sessionId?: string, paymentIntentId?: string): Promise<IResponse<IDefaultResponse>> =>
    api.put(`/order/confirm-order-payment/${orderId}`, {
        payment: isPayment,
        ...(sessionId && { sessionId }),
        ...(paymentIntentId && { paymentIntentId }),
    });

const deleteOrder = (orderId: string): Promise<IResponse<IDefaultResponse>> => api.delete(`/order/${orderId}`);

const OrderService = {
    getMyOrders,
    createOrderWithCashOnDeliveryPaymentMethod,
    createOrderWithStripePaymentMethod,
    deleteOrder,
    confirmOrderPayment
}

export default OrderService