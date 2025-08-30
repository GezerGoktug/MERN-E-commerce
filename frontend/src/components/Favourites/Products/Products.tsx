import styles from './Products.module.scss'
import ProductItemSkeleton from '../../common/ProductItem/ProductItemSkeleton'
import { RiMenuSearchLine } from 'react-icons/ri'
import Button from '../../ui/Button/Button'
import { GrPowerReset } from 'react-icons/gr'
import ProductCard from '../../common/ProductItem/ProductItem'
import { useQuery } from '@tanstack/react-query'
import api from '../../../utils/api'
import { IPaginationResult, ProductSearchQueryType, ProductType } from '../../../types/types'
import { useQueryParams } from '../../../hooks/use-query-params'
import { generateSortingType } from '../../../helper/generateSortingType'
import { useEffect } from 'react'
import { setPagination } from '../../../store/product/actions'
import buildQuery from '../../../utils/queryStringfy'
import DataStateHandler from '../../common/DataStateHandler/DataStateHandler'
import { FaCircleXmark } from 'react-icons/fa6'

const Products = () => {
    const { queryState, clearQuery } = useQueryParams<Pick<ProductSearchQueryType, 'page' | 'categories' | 'searchQuery' | 'subCategories' | 'sorting'>>({
        page: 0,
        categories: [],
        subCategories: [],
        searchQuery: '',
        sorting: 'DEFAULT'
    })

    const { searchQuery, page, categories, subCategories, sorting } = queryState;

    const { data, isPending, isError, refetch } = useQuery<{
        data: IPaginationResult<ProductType, object>;
    }>({
        queryKey: [
            'favProducts',
            sorting,
            page,
            categories,
            subCategories,
            searchQuery,
        ],
        queryFn: () => {
            const sortProps = generateSortingType(sorting);

            return api.get(`/product/favourites/list?${buildQuery({
                categories,
                subCategory: subCategories,
                ...(searchQuery.trim().length > 2 && { searchQuery }),
                ...(sortProps.field && { sortField: sortProps.field }),
                sortType: sortProps.type,
                page,
                pageSize: 10
            })}`)
        }
    })

    useEffect(() => {
        if (data) {
            setPagination({
                pageCount: data?.data.totalPage,
                hasNext: data.data.hasNext,
                hasPrev: data.data.hasPrev
            });
        }
    }, [data]);

    return (
        <div className={styles.products}>
            <DataStateHandler
                data={data?.data.content}
                isLoading={isPending}
                isError={isError}
                errorFallback={
                    <div className={styles.products_error}>
                        <FaCircleXmark className={styles.products_error_icon} />
                        <div className={styles.products_error_text}>
                            <h6>Error</h6>
                            <p>
                                We occurred a error while your get products with your desired filters .Please you retry to get products with your desired filters.
                            </p>
                            <Button
                                className={styles.products_error_btn}
                                rightIcon={GrPowerReset}
                                variant="secondary"
                                onClick={() => refetch()}
                            >
                                RETRY
                            </Button>
                        </div>
                    </div>
                }
                noContentFallback={
                    <div className={styles.products_no_content}>
                        <RiMenuSearchLine className={styles.products_no_content_icon} />
                        <div className={styles.products_no_content_text}>
                            <h6>Not found anything product</h6>
                            <p>
                                We not found anything a product according to your search query.You try to search with different a query
                            </p>
                            <Button
                                className={styles.products_no_content_btn}
                                rightIcon={GrPowerReset}
                                variant="secondary"
                                onClick={() => clearQuery()}
                            >
                                RESET FILTRE
                            </Button>
                        </div>
                    </div>
                }
                loadingFallback={
                    <>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item) => (
                            <ProductItemSkeleton key={'product_skeleton_item' + item} />
                        ))}
                    </>
                }
            >
                {
                    (data) => data.map((item) => (
                        <ProductCard
                            key={"fav_product" + item._id}
                            product={{ ...item, isFav: true }}
                        />
                    ))
                }
            </DataStateHandler>
        </div>
    )
}

export default Products