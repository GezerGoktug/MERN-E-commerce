import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import styles from "./Pagination.module.scss";
import { usePageCount } from "../../../store/product/hooks";
import { useQueryParams } from "../../../hooks/use-query-params";
import { useEffect } from "react";

const Pagination = () => {
  const pageCount = usePageCount();

  const { queryState: { page }, querySetters: { setPage } } = useQueryParams<{ page: number }>({
    page: 0
  })

  const nextPage = () => setPage(page === pageCount - 1 ? page : page + 1);
  const prevPage = () => setPage(page === 0 ? page : page - 1);

  useEffect(() => {
    if (page < 0)
      setPage(0);
    else if ((page > pageCount - 1) && pageCount > 1)
      setPage(pageCount - 1);
    else if (pageCount === 1)
      setPage(0);

  }, [page, pageCount])

  if (pageCount === 0)
    return null;

  return (
    <div className={styles.pagination_wrapper}>
      <div className={styles.pagination}>
        <div
          onClick={() => prevPage()}
          className={styles.pagination_arrow_icon_wrapper}
        >
          <FaArrowLeft className={styles.pagination_arrow_icon} size={20} />
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
          <FaArrowRight className={styles.pagination_arrow_icon} size={20} />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
