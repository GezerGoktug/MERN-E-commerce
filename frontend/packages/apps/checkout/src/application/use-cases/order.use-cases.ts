import { useMutation, type UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import type { IError, IResponse, IDefaultResponse } from "@forever/api";
import type { IConfirmOrderVariables, ICreateOrderVariables, ICreateOrderWithStripeIntentResponse } from "../../domain/entities/order.entity";
import OrderRepository from "../../infrastructure/repositories/order.repository";

const useCreateOrderWithCashOnDeliveryPaymentMethodMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, ICreateOrderVariables>
) => useMutation<IResponse<IDefaultResponse>, IError, ICreateOrderVariables>({
    mutationKey: ["create_order_with_cash_on_delivery"],
    mutationFn: (body) => OrderRepository.createOrderWithCashOnDeliveryPaymentMethod(body),
    ...mutationDetails,
});

const useCreateStripePaymentIntentMutation = (
    mutationDetails?: UseMutationOptions<IResponse<ICreateOrderWithStripeIntentResponse>, IError, ICreateOrderVariables>
) => useMutation<IResponse<ICreateOrderWithStripeIntentResponse>, IError, ICreateOrderVariables>({
    mutationKey: ["create_stripe_payment_intent"],
    mutationFn: (body) => OrderRepository.createStripePaymentIntent(body),
    ...mutationDetails,
});

const useDeleteOrderMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, string>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};
    return useMutation<IResponse<IDefaultResponse>, IError, string>({
        mutationFn: (orderId) => OrderRepository.deleteOrder(orderId),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["my-orders"] });
            if (onSuccess) onSuccess(data, variables, context);
        },
        ...details,
    });
};

const useConfirmOrderPaymentMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, IConfirmOrderVariables>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};
    return useMutation<IResponse<IDefaultResponse>, IError, IConfirmOrderVariables>({
        mutationFn: ({ orderId, isPayment, sessionId, paymentIntentId }) =>
            OrderRepository.confirmOrderPayment(orderId, isPayment, sessionId, paymentIntentId),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["my-orders"] });
            if (onSuccess) onSuccess(data, variables, context);
        },
        ...details,
    });
};

export {
    useCreateOrderWithCashOnDeliveryPaymentMethodMutation,
    useCreateStripePaymentIntentMutation,
    useDeleteOrderMutation,
    useConfirmOrderPaymentMutation,
};