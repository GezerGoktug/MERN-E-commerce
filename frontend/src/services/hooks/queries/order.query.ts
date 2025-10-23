import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import OrderService from "../../actions/order.service";
import { IResponse, IError } from "../../../types/common.type";
import { IOrder } from "../../../types/order.type";

const useMyOrdersQuery = (
    queryOptions?: UseQueryOptions<IResponse<IOrder[]>, IError>
) =>
    useQuery<IResponse<IOrder[]>, IError>({
        queryKey: ["my-orders"],
        queryFn: () => OrderService.getMyOrders(),
        ...queryOptions,
    });


const useAdminOrdersQuery = (
    queryOptions?: UseQueryOptions<IResponse<IOrder[]>, IError>
) =>
    useQuery<IResponse<IOrder[]>, IError>({
        queryKey: ["admin-orders"],
        queryFn: () => OrderService.getAdminOrders(),
        ...queryOptions,
    });


export { useAdminOrdersQuery, useMyOrdersQuery };
