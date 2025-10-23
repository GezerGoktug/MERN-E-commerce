import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { IError, IResponse } from "../../../types/common.type";
import UserService from "../../actions/user.service";
import { IResetPasswordVariables, IVerifyResetPasswordCodeVariables, IVerifyResetPasswordResponse } from "../../../types/user.type";
import { IDefaultResponse } from "../../../types/common.type";

const useResetPasswordRequestMutation = (mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, string>) =>
    useMutation<IResponse<IDefaultResponse>, IError, string>({
        mutationKey: ["reset-password-request"],
        mutationFn: (resetPasswordEmail) => UserService.resetPasswordRequest(resetPasswordEmail),
        ...mutationDetails
    })


const useVerifyResetPasswordCodeMutation = (mutationDetails?: UseMutationOptions<IResponse<IVerifyResetPasswordResponse>, IError, IVerifyResetPasswordCodeVariables>) =>
    useMutation<IResponse<IVerifyResetPasswordResponse>, IError, IVerifyResetPasswordCodeVariables>({
        mutationKey: ["verify-reset-password-code"],
        mutationFn: ({ resetPasswordEmail, resetPasswordCode }) => {
            const searchParams = new URLSearchParams({
                resetPasswordEmail,
                resetPasswordCode
            })
            return UserService.evalResetPasswordCode(searchParams.toString())
        },
        ...mutationDetails
    })

const useResetPasswordMutation = (mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, IResetPasswordVariables>) =>
    useMutation<IResponse<IDefaultResponse>, IError, IResetPasswordVariables>({
        mutationKey: ["reset-password"],
        mutationFn: (body) => UserService.resetPassword(body),
        ...mutationDetails
    })

export {
    useResetPasswordRequestMutation,
    useVerifyResetPasswordCodeMutation,
    useResetPasswordMutation
}    