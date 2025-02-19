import { Link } from "react-router-dom";
import styles from "./Topbar.module.scss";
import Button from "../../../ui/Button/Button";
import { FaBars } from "react-icons/fa6";
import { useState } from "react";
import MobileAside from "../MobileAside/MobileAside";
import { AnimatePresence } from "framer-motion";

const Topbar = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false);

  return (
    <div className={styles.topbar_wrapper}>
      <AnimatePresence>
        {sideBarOpen && (
          <MobileAside closeSidebar={() => setSideBarOpen(false)} />
        )}
      </AnimatePresence>
      <div className={styles.topbar}>
        <div className={styles.topbar_left}>
          <FaBars
            onClick={() => setSideBarOpen(true)}
            size={25}
            className={styles.topbar_toggle_bar_icon}
          />
          <img src="/admin-logo.png" alt="" />
        </div>
        <Link to="/">
          <Button size="sm" className={styles.topbar_logout_btn}>
            Log out
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
