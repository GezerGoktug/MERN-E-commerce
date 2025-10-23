import { IResponse } from "../../types/common.type";
import { IOrder } from "../../types/order.type";
import api from "../../utils/api";
import { IDefaultResponse } from "../../types/common.type";
import { ICreateOrderVariables, ICreateOrderWithStripeResponse } from "../../types/order.type";


const getMyOrders = (): Promise<IResponse<IOrder[]>> => api.get("/order/my-order");
const getAdminOrders = (): Promise<IResponse<IOrder[]>> => api.get("/order/admin/list");;

const createOrderWithCashOnDeliveryPaymentMethod = (body: ICreateOrderVariables): Promise<IResponse<IDefaultResponse>> => api.post("/order/add", body)

const createOrderWithStripePaymentMethod = (body: ICreateOrderVariables): Promise<IResponse<ICreateOrderWithStripeResponse>> => api.post("/payment", body)

const confirmOrderPayment = (orderId: string, isPayment: boolean, sessionId: string): Promise<IResponse<IDefaultResponse>> => api.put(`/order/confirm-order-payment/${orderId}`, { payment: isPayment, sessionId });

const deleteOrder = (orderId: string): Promise<IResponse<IDefaultResponse>> => api.delete(`/order/${orderId}`);

const OrderService = {
    getMyOrders,
    getAdminOrders,
    createOrderWithCashOnDeliveryPaymentMethod,
    createOrderWithStripePaymentMethod,
    deleteOrder,
    confirmOrderPayment
}

export default OrderService