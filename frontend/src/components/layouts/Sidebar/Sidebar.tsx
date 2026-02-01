import { MdArrowBackIos } from "react-icons/md";
import Backdrop from "../../ui/Backdrop/Backdrop";
import Overlay from "../../ui/Overlay/Overlay";
import styles from "./Sidebar.module.scss";
import OutsideClickHandler from "react-outside-click-handler";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useTheme } from "../../../store/theme/hooks";
import { FaMoon } from "react-icons/fa6";
import { setTheme } from "../../../store/theme/actions";
import { IoSunny } from "react-icons/io5";
const Sidebar = ({ onClose }: { onClose: () => void }) => {
  const theme = useTheme()
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
            <div className={styles.sidebar_top}>
              <div onClick={onClose} className={styles.backButton}>
                <MdArrowBackIos />
                Back
              </div>
              <div className={styles.themeButton} onClick={() => setTheme(theme === "dark" ? "light" : "dark")} >
                {
                  theme === "dark" ?
                    <>
                      Dark
                      <FaMoon size={25} />
                    </>
                    :
                    <>
                      Light
                      <IoSunny size={25} />
                    </>
                }
              </div>
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
