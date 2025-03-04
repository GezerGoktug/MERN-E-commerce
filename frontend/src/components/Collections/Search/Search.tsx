import { FaXmark } from "react-icons/fa6";
import Input from "../../ui/Input/Input";
import styles from "./Search.module.scss";
import { CiSearch } from "react-icons/ci";
import { setSearchQuery } from "../../../store/filter/actions";
import useDebounce from "../../../hooks/useDebounce";
import { useEffect, useState } from "react";
const Search = ({ closeSearchBar }: { closeSearchBar: () => void }) => {
  const [text, setText] = useState("");
  const debouncedVal = useDebounce<string>(text, 700);

  useEffect(() => {
    setSearchQuery(debouncedVal);
  }, [debouncedVal]);

  return (
    <div className={styles.search_bar_wrapper}>
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
    </div>
  );
};

export default Search;
