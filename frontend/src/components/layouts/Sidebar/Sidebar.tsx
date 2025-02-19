import { MdArrowBackIos } from "react-icons/md";
import Backdrop from "../../ui/Backdrop/Backdrop";
import Overlay from "../../ui/Overlay/Overlay";
import styles from "./Sidebar.module.scss";
import OutsideClickHandler from "react-outside-click-handler";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { motion } from "framer-motion";
const Sidebar = ({ onClose }: { onClose: () => void }) => {
  const links = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Collection",
      href: "/collection",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ];
  return (
    <Overlay>
      <Backdrop>
        <OutsideClickHandler
          onOutsideClick={() => {
            onClose();
          }}
          display="contents"
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.2 }}
            className={styles.sidebar}
          >
            <div onClick={onClose} className={styles.backButton}>
              <MdArrowBackIos />
              Back
            </div>
            <nav>
              <ul>
                {links.map((link, i) => (
                  <li key={"aside_link_" + i}>
                    <NavLink
                      onClick={onClose}
                      to={link.href}
                      className={({ isActive }) =>
                        clsx(styles.aside_link, { [styles.active]: isActive })
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        </OutsideClickHandler>
      </Backdrop>
    </Overlay>
  );
};

export default Sidebar;
