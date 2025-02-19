import OutsideClickHandler from "react-outside-click-handler";
import Backdrop from "../../../ui/Backdrop/Backdrop";
import Overlay from "../../../ui/Overlay/Overlay";
import styles from "./MobileAside.module.scss";
import Sidebar from "../Sidebar/Sidebar";
import { motion } from "framer-motion";

const MobileAside = ({ closeSidebar }: { closeSidebar: () => void }) => {
  return (
    <Overlay>
      <Backdrop>
        <OutsideClickHandler
          display="contents"
          onOutsideClick={() => closeSidebar()}
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.2 }}
            className={styles.mobile_sidebar_wrapper}
          >
            <img src="/admin-logo.png" alt="" />
            <Sidebar isMobileAside />
          </motion.div>
        </OutsideClickHandler>
      </Backdrop>
    </Overlay>
  );
};

export default MobileAside;
