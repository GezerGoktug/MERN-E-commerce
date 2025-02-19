import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import styles from "./Pagination.module.scss";
import { nextPage, prevPage } from "../../../store/filter/actions";
import { usePage } from "../../../store/filter/hooks";

const Pagination = () => {
  const page = usePage();

  return (
    <div className={styles.pagination_wrapper}>
      <div className={styles.pagination}>
        <div
          onClick={() => prevPage()}
          className={styles.pagination_arrow_icon_wrapper}
        >
          <FaArrowLeft
            className={styles.pagination_arrow_icon}
            fill="black"
            size={20}
          />
        </div>

        <div className={styles.pagination_title}>
          Showing products{" "}
          <span className={styles.pagination_range}>
            {page * 15 + 1} - {(page + 1) * 15}
          </span>
        </div>
        <div
          onClick={() => nextPage()}
          className={styles.pagination_arrow_icon_wrapper}
        >
          <FaArrowRight
            className={styles.pagination_arrow_icon}
            fill="black"
            size={20}
          />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
