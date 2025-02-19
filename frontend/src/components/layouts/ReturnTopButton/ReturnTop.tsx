import { FaArrowUp } from "react-icons/fa6";
import styles from "./ReturnTop.module.scss";
import {
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
  motion,
} from "framer-motion";
import { useState } from "react";

const ReturnTop = () => {
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (val) => {
    if (val > 500) {
      setShow(true);
    } else {
      setShow(false);
    }
  });

  
  const returnTopHandle = () => {
    window.scrollTo({
        top:0,
        behavior:"smooth"
    })
  }
  

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={styles.return_top_btn}
            onClick={returnTopHandle}
          >
            <FaArrowUp fill="white" size={25} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReturnTop;
