import { useEffect, useState } from 'react'
import Select from 'react-select';
import styles from './FilterModal.module.scss';

import { FaMagnifyingGlass } from 'react-icons/fa6';
import { useQueryParams } from '@forever/query-kit';
import type { CategoriesType, ProductSearchQueryType, SubCategoriesType } from '../../../../types/product.type';
import { type OptionsType } from '../Filter';
import { Button, Input } from '@forever/ui-kit';

const categoriesOptions: OptionsType<CategoriesType> = [
    { value: 'Men', label: 'Men' },
    { value: 'Women', label: 'Women' },
    { value: 'Kids', label: 'Kids' }
]

const subCategoriesOptions: OptionsType<SubCategoriesType> = [
    { value: 'Topwear', label: 'Topwear' },
    { value: 'Bottomwear', label: 'Bottomwear' },
    { value: 'Winterwear', label: 'Winterwear' }
]

const FilterModal = ({ closeModal }: { closeModal: () => void }) => {
    const { queryState, setQueries } = useQueryParams<Pick<ProductSearchQueryType, 'categories' | 'searchQuery' | 'subCategories'>>({
        categories: [],
        subCategories: [],
        searchQuery: '',
    })

    const { categories, subCategories, searchQuery } = queryState;

    const [filterData, setFilterData] = useState<{
        text: string,
        categories: CategoriesType[],
        subCategories: SubCategoriesType[]
    }>({
        text: '',
        categories: [],
        subCategories: []
    })

    useEffect(() => {
        setFilterData({
            text: searchQuery,
            categories: categories,
            subCategories: subCategories
        })
    }, [])

    const applyFilter = () => {
        setQueries({
            categories: filterData.categories,
            subCategories: filterData.subCategories,
            searchQuery: filterData.text
        })
        closeModal()
    }


    return (
        <div className={styles.filter_modal_content}>
            <h6>
                Filter
            </h6>
            <Input
                size='lg'
                placeholder='Enter a search'
                onChange={(e) => setFilterData({ ...filterData, text: e.target.value })}
                rightIcon={FaMagnifyingGlass}
                rightIconSize={15}
                className={styles.search_input} />
            <Select
                defaultValue={categories.map((dt) => ({ value: dt, label: dt }))}
                placeholder='Category'
                onChange={(dt) => setFilterData({ ...filterData, categories: dt.map(item => item.value) })}
                isMulti
                className={styles.form_select}
                options={categoriesOptions}
                classNamePrefix="react-select"
            />
            <Select
                defaultValue={subCategories.map((dt) => ({ value: dt, label: dt }))}
                placeholder='Type'
                isMulti
                className={styles.form_select}
                onChange={(dt) => setFilterData({ ...filterData, subCategories: dt.map(item => item.value) })}
                options={subCategoriesOptions}
                classNamePrefix="react-select"
            />


            <Button onClick={() => applyFilter()} className={styles.filter_modal_btn}>
                APPLY
            </Button>

        </div>
    )
}

export default FilterModal