import { FaXmark } from "react-icons/fa6";
import Input from "../../ui/Input/Input";
import styles from "./Search.module.scss";
import { CiSearch } from "react-icons/ci";
import useDebounce from "../../../hooks/use-debounce";
import { useEffect, useState } from "react";
import { useQueryParams } from "../../../hooks/use-query-params";
import { ProductSearchQueryType } from "../../../types/product.type";
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from "react-router-dom";

const Search = () => {
  const { state } = useLocation();
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  useEffect(() => {    
    if (state?.searchBarOpen) {
      setSearchBarOpen(true);
    }
  }, [state]);

  const [text, setText] = useState("");
  const debouncedVal = useDebounce<string>(text, 700);

  const { querySetters: { setSearchQuery } } = useQueryParams<Pick<ProductSearchQueryType, 'searchQuery'>>({
    searchQuery: ''
  });
  
  useEffect(() => {
    setSearchQuery(debouncedVal);
  }, [debouncedVal]);

  const closeSearchBar = () => setSearchBarOpen(false);

  return (
    <AnimatePresence>
      {
        searchBarOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0, }}
            transition={{
              opacity: { duration: 0.1 },
              height: { duration: 0.3 },
              ease: 'linear'
            }}
            className={styles.search_bar_wrapper}
          >
            <form>
              <div className={styles.search_input_wrapper}>
                <Input
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Search"
                  rightIcon={CiSearch}
                  className={styles.search_input}
                />
                <FaXmark
                  onClick={() => {
                    setSearchQuery("");
                    closeSearchBar();
                  }}
                  size={20}
                  className={styles.search_bar_close_icon}
                />
              </div>
            </form>
          </motion.div>
        )
      }
    </AnimatePresence>
  );
};

export default Search;
