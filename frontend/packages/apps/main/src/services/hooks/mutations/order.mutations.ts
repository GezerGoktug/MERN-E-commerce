import { useMutation, type UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import type { IError, IResponse, IDefaultResponse } from "@forever/api";
import type { IConfirmOrderVariables, ICreateOrderVariables, ICreateOrderWithStripeIntentResponse } from "../../../types/order.type";
import OrderService from "../../actions/order.service";

const useCreateOrderWithCashOnDeliveryPaymentMethodMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, ICreateOrderVariables>
) => useMutation<IResponse<IDefaultResponse>, IError, ICreateOrderVariables>({
    mutationKey: ["create_order_with_cash_on_delivery"],
    mutationFn: (body) =>
        OrderService.createOrderWithCashOnDeliveryPaymentMethod(body),
    ...mutationDetails
});

const useCreateOrderWithStripePaymentMethodMutation = (
    mutationDetails?: UseMutationOptions<IResponse<ICreateOrderWithStripeIntentResponse>, IError, ICreateOrderVariables>
) => useMutation<IResponse<ICreateOrderWithStripeIntentResponse>, IError, ICreateOrderVariables>({
    mutationKey: ["create_order_with_stripe"],
    mutationFn: (body) => OrderService.createOrderWithStripePaymentMethod(body),
    ...mutationDetails,
});

const useDeleteOrderMutation = (mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, string>) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};
    return useMutation<IResponse<IDefaultResponse>, IError, string>({
        mutationFn: (orderId) => OrderService.deleteOrder(orderId),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["my-orders"] });
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...details
    })
}

const useConfirmOrderPaymentMutation = (mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, IConfirmOrderVariables>) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};
    return useMutation<IResponse<IDefaultResponse>, IError, IConfirmOrderVariables>({
        mutationFn: ({ orderId, isPayment, sessionId, paymentIntentId }) =>
            OrderService.confirmOrderPayment(orderId, isPayment, sessionId, paymentIntentId),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["my-orders"] });
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...details
    })
}


export {
    useCreateOrderWithCashOnDeliveryPaymentMethodMutation,
    useCreateOrderWithStripePaymentMethodMutation,
    useDeleteOrderMutation,
    useConfirmOrderPaymentMutation
}