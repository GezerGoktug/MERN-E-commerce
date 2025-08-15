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
import { setPageCount } from '../../../store/product/actions'

const Products = () => {
    const { queryState, clearQuery } = useQueryParams<Pick<ProductSearchQueryType, 'page' | 'categories' | 'searchQuery' | 'subCategories' | 'sorting'>>({
        page: 0,
        categories: [],
        subCategories: [],
        searchQuery: '',
        sorting: 'DEFAULT'
    })

    const { searchQuery, page, categories, subCategories, sorting } = queryState;

    const { data, isPending } = useQuery<{
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
            const categoriesUrl = categories
                .map((item) => {
                    return `categories=${item}&`;
                })
                .join("");

            const subCategoriesUrl = subCategories
                .map((item) => {
                    return `subCategory=${item}&`;
                })
                .join("");

            const searchQueryUrl =
                searchQuery.trim().length < 3 ? "" : `&searchQuery=${searchQuery}`;

            const sortProps = generateSortingType(sorting);
            const sortUrl =
                "&" +
                (sortProps.field ? `sortField=${sortProps.field}&` : "") +
                `sortType=${sortProps.type}`;
            return api.get(`/product/favourites/list?${categoriesUrl}${subCategoriesUrl}page=${page}&pageSize=10${sortUrl}${searchQueryUrl}`)
        }
    })

    useEffect(() => {
        if (data) {
            setPageCount(data?.data.totalPage);
        }
    }, [data]);

    return (
        <div className={styles.products}>
            {isPending ? (
                <>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item) => (
                        <ProductItemSkeleton key={'product_skeleton_item' + item} />
                    ))}
                </>
            ) : (
                <>
                    {
                        data?.data?.content.length === 0 ? (
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
                        ) : data?.data?.content.map((item) => (
                            <ProductCard
                                key={"fav_product" + item._id}
                                product={{ ...item, isFav: true }}
                            />
                        ))
                    }
                </>
            )}
        </div>
    )
}

export default Products