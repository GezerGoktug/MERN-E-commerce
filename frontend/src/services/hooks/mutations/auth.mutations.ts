import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import AuthService from "../../actions/auth.service";
import { IError, IResponse } from "../../../types/common.type";
import { ILoginVariables, IAuthResponse, IRegisterVariables } from "../../../types/auth.type";
import { IDefaultResponse } from "../../../types/common.type";

const useLogoutMutation = (mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError>) =>
    useMutation<IResponse<IDefaultResponse>, IError>({
        mutationKey: ["logout"],
        mutationFn: () => AuthService.logout(),
        ...mutationDetails
    })

const useLoginMutation = (mutationDetails?: UseMutationOptions<IResponse<IAuthResponse>, IError, ILoginVariables>) =>
    useMutation<IResponse<IAuthResponse>, IError, ILoginVariables>({
        mutationKey: ["login"],
        mutationFn: (body) => AuthService.login(body),
        ...mutationDetails
    })

const useRegisterMutation = (mutationDetails?: UseMutationOptions<IResponse<IAuthResponse>, IError, IRegisterVariables>) =>
    useMutation<IResponse<IAuthResponse>, IError, IRegisterVariables>({
        mutationKey: ["register"],
        mutationFn: (body) => AuthService.register(body),
        ...mutationDetails
    })

export {
    useLogoutMutation,
    useLoginMutation,
    useRegisterMutation
}