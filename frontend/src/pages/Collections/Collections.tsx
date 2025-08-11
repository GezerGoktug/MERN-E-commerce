import Filter from "../../components/Collections/Filter/Filter";
import Products from "../../components/Collections/Products/Products";
import Search from "../../components/Collections/Search/Search";
import styles from "./Collections.module.scss";
import Pagination from "../../components/Collections/Pagination/Pagination";
import { Helmet } from "react-helmet";

const Collections = () => {
  return (
    <div className={styles.collections_wrapper}>
      <Helmet>
        <title>Collections - Forever</title>
        <meta
          name="description"
          content="Browse our latest collection of stylish clothing. Find the perfect outfit for every occasion at Forever!"
        />
      </Helmet>
      <Search/>
      <div className={styles.collections_section}>
        <Filter />
        <div>
          <Products />
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default Collections;
