import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IError, IResponse } from "@forever/api";
import type { IAuthResponse } from "../../domain/entities/auth.entity";
import AuthRepository from "../../infrastructure/repositories/auth.repository";

const useCheckAuthSessionQuery = (
    queryOptions?: Omit<
        UseQueryOptions<IResponse<Omit<IAuthResponse, "message" | "accessToken">>, IError>,
        "queryKey"
    >
) =>
    useQuery({
        queryKey: ["check-auth-session"],
        queryFn: () => AuthRepository.getSession(),
        ...queryOptions,
    });

export { useCheckAuthSessionQuery };