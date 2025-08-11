import { ChangeEvent, useEffect, useState } from "react";
import styles from "./Filter.module.scss";
import { IoIosArrowUp } from "react-icons/io";
import clsx from "clsx";
import { useMediaQuery } from "react-responsive";
import Button from "../../ui/Button/Button";
import { useMaxPrice } from "../../../store/product/hooks";
import { useQueryParams } from "../../../hooks/use-query-params";
import { ProductSearchQueryType } from "../../../types/types";
import useFirstRenderEffect from "../../../hooks/use-first-render-effect";


const Filter = () => {
  const [openFilterOptions, setOpenFilterOptions] = useState(true);
  const isMobile = useMediaQuery({
    query: "(max-width: 640px)",
  });

  const { querySetters, queryState } = useQueryParams<Pick<ProductSearchQueryType, 'categories' | 'subCategories' | 'minPrice'>>({
    categories: [],
    subCategories: [],
    minPrice: 0
  });  

  const { setCategories, setMinPrice, setSubCategories } = querySetters;
  const { categories, minPrice, subCategories } = queryState;

  const maxPrice = useMaxPrice();
  const [lowerPrice, setLowerPrice] = useState(0);

  const handleCategoryChance = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setCategories([...categories, e.target.value])
    } else {
      setCategories(categories.filter(item => item !== e.target.value));
    }
  };

  const handleSubCategoryChance = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSubCategories([...subCategories, e.target.value])
    } else {
      setSubCategories(subCategories.filter(item => item !== e.target.value));
    }
  };

  const handleMinPriceChance = () => setMinPrice(lowerPrice);

  useFirstRenderEffect(() => {
    setLowerPrice(minPrice)
  })

  useEffect(() => {
    if (minPrice === 0) {
      setLowerPrice(0)
    }
  }, [minPrice])

  return (
    <div className={styles.filter}>
      <div
        onClick={() =>
          setOpenFilterOptions(isMobile ? !openFilterOptions : true)
        }
        className={styles.filter_header}
      >
        <h5>FILTERS</h5>
        <IoIosArrowUp
          size={20}
          className={clsx(styles.filter_header_icon, {
            [styles.open_icon]: openFilterOptions,
          })}
        />
      </div>
      {openFilterOptions && (
        <>
          <div className={styles.filter_box}>
            <h6>CATEGORIES</h6>
            <div className={styles.filter_option}>
              <input
                onChange={handleCategoryChance}
                value="Men"
                checked={categories.includes('Men')}
                type="checkbox"
              />
              <span>Men</span>
            </div>
            <div className={styles.filter_option}>
              <input
                onChange={handleCategoryChance}
                value="Women"
                checked={categories.includes('Women')}
                type="checkbox"
              />
              <span>Women</span>
            </div>
            <div className={styles.filter_option}>
              <input
                onChange={handleCategoryChance}
                value="Kids"
                checked={categories.includes('Kids')}
                type="checkbox"
              />
              <span>Kids</span>
            </div>
          </div>

          <div className={styles.filter_box}>
            <h6>TYPE</h6>
            <div className={styles.filter_option}>
              <input
                onChange={handleSubCategoryChance}
                value="Topwear"
                checked={subCategories.includes('Topwear')}
                type="checkbox"
              />
              <span>Topwear</span>
            </div>
            <div className={styles.filter_option}>
              <input
                onChange={handleSubCategoryChance}
                value="Bottomwear"
                checked={subCategories.includes('Bottomwear')}
                type="checkbox"
              />
              <span>Bottomwear</span>
            </div>
            <div className={styles.filter_option}>
              <input
                onChange={handleSubCategoryChance}
                value="Winterwear"
                checked={subCategories.includes('Winterwear')}
                type="checkbox"
              />
              <span>Winterwear</span>
            </div>
          </div>

          <div className={styles.filter_box}>
            <h6>PRICE</h6>
            <div className={styles.filter_range_prices}>
              <span>${lowerPrice}</span>
              <span>${maxPrice}</span>
            </div>
            <input
              onChange={(e) => setLowerPrice(+e.target.value)}
              className={styles.filter_range}
              defaultValue="0"
              value={lowerPrice}
              min="0"
              max={maxPrice}
              type="range"
            />
            <Button
              onClick={() => handleMinPriceChance()}
              className={styles.filter_range_btn}
              size="sm"
            >
              APPLY
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Filter;
