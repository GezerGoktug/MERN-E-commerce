import { ChangeEvent, useState } from "react";
import styles from "./Filter.module.scss";
import { IoIosArrowUp } from "react-icons/io";
import clsx from "clsx";
import { useMediaQuery } from "react-responsive";
import { setCategories, setSubCategories } from "../../../store/filter/actions";

const Filter = () => {
  const [openFilterOptions, setOpenFilterOptions] = useState(true);
  const isMobile = useMediaQuery({
    query: "(max-width: 640px)",
  });

  const handleCategoryChance = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setCategories(e.target.value, "ADD");
    } else {
      setCategories(e.target.value, "DELETE");
    }
  };

  const handleSubCategoryChance = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSubCategories(e.target.value, "ADD");
    } else {
      setSubCategories(e.target.value, "DELETE");
    }
  };

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
                type="checkbox"
              />
              <span>Men</span>
            </div>
            <div className={styles.filter_option}>
              <input
                onChange={handleCategoryChance}
                value="Women"
                type="checkbox"
              />
              <span>Women</span>
            </div>
            <div className={styles.filter_option}>
              <input
                onChange={handleCategoryChance}
                value="Kids"
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
                type="checkbox"
              />
              <span>Topwear</span>
            </div>
            <div className={styles.filter_option}>
              <input
                onChange={handleSubCategoryChance}
                value="Bottomwear"
                type="checkbox"
              />
              <span>Bottomwear</span>
            </div>
            <div className={styles.filter_option}>
              <input
                onChange={handleSubCategoryChance}
                value="Winterwear"
                type="checkbox"
              />
              <span>Winterwear</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Filter;
