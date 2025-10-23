import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { IError, IResponse } from "../../../types/common.type";
import ProductService from "../../actions/product.service";
import { DeleteCommentVariables, HandleFavouriteVariables, ICreateCommentVariables, IUpdateProductVariables, UpdateCommentVariables } from "../../../types/product.type";
import { IDefaultResponse } from "../../../types/common.type";


const useAddProductMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, FormData>
) => useMutation<IResponse<IDefaultResponse>, IError, FormData>({
    mutationKey: ["add_product"],
    mutationFn: (body) =>
        ProductService.addProduct(body),
    ...mutationDetails
});

const useDeleteProductMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, string>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};

    return useMutation<IResponse<IDefaultResponse>, IError, string>({
        mutationKey: ["admin_delete_product"],
        mutationFn: (id) => ProductService.deleteProduct(id),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...details
    });
};


const useUpdateProductMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, IUpdateProductVariables>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};

    return useMutation<IResponse<IDefaultResponse>, IError, IUpdateProductVariables>({
        mutationKey: ["admin_update_product"],
        mutationFn: ({ id, updatedProduct }) => ProductService.updateProduct(id, updatedProduct),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...details
    });
};

const useHandleFavouriteMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, HandleFavouriteVariables>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};

    return useMutation<IResponse<IDefaultResponse>, IError, HandleFavouriteVariables>({
        mutationKey: ["handle_favourites"],
        mutationFn: ({ isFav, productId }) => isFav ? ProductService.removeFav(productId) : ProductService.addFav(productId),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ['favProductCount'] })
            await queryClient.invalidateQueries({ queryKey: ['favProducts'] })
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...details
    });
};

//! COMMENT MUTATIONS
const useUpdateCommentMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, UpdateCommentVariables>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};

    return useMutation<IResponse<IDefaultResponse>, IError, UpdateCommentVariables>({
        mutationKey: ["update_comment"],
        mutationFn: ({ commentId, body }) =>
            ProductService.updateComment(commentId, body),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["product_detail"] });
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...details
    });
};

const useDeleteCommentMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, DeleteCommentVariables>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};

    return useMutation<IResponse<IDefaultResponse>, IError, DeleteCommentVariables>({
        mutationKey: ["delete_comment"],
        mutationFn: ({ commentId, productId }) =>
            ProductService.deleteComment(commentId, productId),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["product_detail"] });
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...details
    });
};

const useCreateCommentMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, ICreateCommentVariables>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};

    return useMutation<IResponse<IDefaultResponse>, IError, ICreateCommentVariables>({
        mutationKey: ["create_comment"],
        mutationFn: (data) =>
            ProductService.createComment(data),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["product_detail"] });
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...details
    });
};


export {
    useAddProductMutation,
    useDeleteProductMutation,
    useUpdateProductMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
    useCreateCommentMutation,
    useHandleFavouriteMutation
};
