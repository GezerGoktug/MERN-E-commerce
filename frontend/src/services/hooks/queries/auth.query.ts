import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IError, IResponse } from "../../../types/common.type";
import { IAuthResponse } from "../../../types/auth.type";
import AuthService from "../../actions/auth.service";

const useCheckAuthSessionQuery = (queryOptions?: Omit<UseQueryOptions<IResponse<Omit<IAuthResponse, "message" | "accessToken">>, IError>, "queryKey">) => useQuery({
    queryKey: ["check-auth-session"],
    queryFn: () => AuthService.getSession(),
    ...queryOptions,
});

export {
    useCheckAuthSessionQuery
}