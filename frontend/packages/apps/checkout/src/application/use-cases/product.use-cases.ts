// ─── Queries ───────────────────────────────────────────────────────────────
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IFavProductCountResponse, IIsProductInFavResponse, ProductDetailType, ProductSearchQueryType, ProductType } from "../../domain/entities/product.entity";
import type { IResponse, IError, IPaginationResult } from "@forever/api";
import { buildQuery } from "@forever/query-kit";
import { generateSortingType } from "../../domain/helpers/generateSortingType";
import ProductRepository from "../../infrastructure/repositories/product.repository";

// ─── Mutations ─────────────────────────────────────────────────────────────
import { useMutation, type UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import type { IDefaultResponse } from "@forever/api";
import type { DeleteCommentVariables, HandleFavouriteVariables, ICreateCommentVariables, UpdateCommentVariables } from "../../domain/entities/product.entity";

const useGetProductsQuery = (
    searchQueries: ProductSearchQueryType,
    queryOptions?: Omit<UseQueryOptions<IResponse<IPaginationResult<Omit<ProductType, "isFav">, { maxPrice: number }>>, IError>, "queryKey">
) => {
    const { searchQuery, sorting, subCategories, categories, page, minPrice } = searchQueries;
    const sortProps = generateSortingType(sorting);
    return useQuery<IResponse<IPaginationResult<Omit<ProductType, "isFav">, { maxPrice: number }>>, IError>({
        queryKey: ["products", searchQuery, sorting, subCategories, categories, page, minPrice],
        queryFn: () => ProductRepository.getProducts(
            buildQuery({
                categories,
                subCategory: subCategories,
                ...(searchQuery && searchQuery.trim().length > 2 && { searchQuery }),
                ...(sortProps.field && { sortField: sortProps.field }),
                sortType: sortProps.type,
                page,
                pageSize: 15,
                minPrice,
            })
        ),
        ...queryOptions,
    });
};

const useGetFavProductsQuery = (
    searchQueries: Omit<ProductSearchQueryType, "minPrice">,
    queryOptions?: Omit<UseQueryOptions<IResponse<IPaginationResult<Omit<ProductType, "isFav">, object>>, IError>, "queryKey">
) => {
    const { categories, page, searchQuery, sorting, subCategories } = searchQueries;
    const sortProps = generateSortingType(sorting);
    return useQuery<IResponse<IPaginationResult<Omit<ProductType, "isFav">, object>>, IError>({
        queryKey: ["favProducts", searchQuery, page, categories, sorting, subCategories],
        queryFn: () => ProductRepository.getFavProducts(
            buildQuery({
                categories,
                subCategory: subCategories,
                ...(searchQuery.trim().length > 2 && { searchQuery }),
                ...(sortProps.field && { sortField: sortProps.field }),
                sortType: sortProps.type,
                page,
                pageSize: 10,
            })
        ),
        ...queryOptions,
    });
};

const useGetFavProductsCountQuery = (
    extraKeys: string[] = [],
    queryOptions?: Omit<UseQueryOptions<IResponse<IFavProductCountResponse>, IError>, "queryKey">
) => useQuery({
    queryKey: ["favProductCount", ...extraKeys],
    queryFn: () => ProductRepository.getFavProductsCount(),
    ...queryOptions,
});

const useGetLatestProductsQuery = (queryOptions?: Omit<UseQueryOptions<IResponse<ProductType[]>, IError>, "queryKey">) =>
    useQuery<IResponse<ProductType[]>, IError>({
        queryKey: ["latest_collections"],
        queryFn: () => ProductRepository.getLatestProducts(),
        ...queryOptions,
    });

const useGetBestSellerProductsQuery = (queryOptions?: Omit<UseQueryOptions<IResponse<ProductType[]>, IError>, "queryKey">) =>
    useQuery<IResponse<ProductType[]>, IError>({
        queryKey: ["best-seller-products"],
        queryFn: () => ProductRepository.getBestSellerProducts(),
        ...queryOptions,
    });

const useGetProductDetailQuery = (id: string, queryOptions?: Omit<UseQueryOptions<IResponse<Omit<ProductDetailType, "isFav">>, IError>, "queryKey">) =>
    useQuery<IResponse<Omit<ProductDetailType, "isFav">>, IError>({
        queryKey: ["product_detail", id],
        queryFn: () => ProductRepository.getProductDetail(id),
        ...queryOptions,
    });

const useIsProductsInFavQuery = (productsIds: string[], extraKeys: string[] = [], queryOptions?: Omit<UseQueryOptions<IResponse<IIsProductInFavResponse[]>, IError>, "queryKey">) =>
    useQuery<IResponse<IIsProductInFavResponse[]>, IError>({
        queryKey: ["is_fav_product_info", productsIds.toString(), ...extraKeys],
        queryFn: () => ProductRepository.isProductsInFav(productsIds),
        ...queryOptions,
    });

const useIsFavouriteProductById = (id: string, queryOptions?: Omit<UseQueryOptions<IResponse<IIsProductInFavResponse>, IError>, "queryKey">) =>
    useQuery<IResponse<IIsProductInFavResponse>, IError>({
        queryKey: ["productDetailFav", id],
        queryFn: () => ProductRepository.isFavProductById(id),
        ...queryOptions,
    });

const useHandleFavouriteMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, HandleFavouriteVariables>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};
    return useMutation<IResponse<IDefaultResponse>, IError, HandleFavouriteVariables>({
        mutationKey: ["handle_favourites"],
        mutationFn: ({ isFav, productId }) =>
            isFav ? ProductRepository.removeFav(productId) : ProductRepository.addFav(productId),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["favProductCount"] });
            await queryClient.invalidateQueries({ queryKey: ["favProducts"] });
            if (onSuccess) onSuccess(data, variables, context);
        },
        ...details,
    });
};

const useUpdateCommentMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, UpdateCommentVariables>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};
    return useMutation<IResponse<IDefaultResponse>, IError, UpdateCommentVariables>({
        mutationKey: ["update_comment"],
        mutationFn: ({ commentId, body }) => ProductRepository.updateComment(commentId, body),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["product_detail"] });
            if (onSuccess) onSuccess(data, variables, context);
        },
        ...details,
    });
};

const useDeleteCommentMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, DeleteCommentVariables>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};
    return useMutation<IResponse<IDefaultResponse>, IError, DeleteCommentVariables>({
        mutationKey: ["delete_comment"],
        mutationFn: ({ commentId, productId }) => ProductRepository.deleteComment(commentId, productId),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["product_detail"] });
            if (onSuccess) onSuccess(data, variables, context);
        },
        ...details,
    });
};

const useCreateCommentMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, ICreateCommentVariables>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};
    return useMutation<IResponse<IDefaultResponse>, IError, ICreateCommentVariables>({
        mutationKey: ["create_comment"],
        mutationFn: (data) => ProductRepository.createComment(data),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["product_detail"] });
            if (onSuccess) onSuccess(data, variables, context);
        },
        ...details,
    });
};

export {
    useGetProductsQuery,
    useGetFavProductsQuery,
    useGetFavProductsCountQuery,
    useGetLatestProductsQuery,
    useGetBestSellerProductsQuery,
    useGetProductDetailQuery,
    useIsProductsInFavQuery,
    useIsFavouriteProductById,
    useHandleFavouriteMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
    useCreateCommentMutation,
};
