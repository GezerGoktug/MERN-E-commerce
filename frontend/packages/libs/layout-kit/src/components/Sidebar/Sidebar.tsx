import { MdArrowBackIos } from "react-icons/md";
import styles from "./Sidebar.module.scss";
import { OutsideClickHandler } from "@forever/common-utils";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useThemeStore } from "@forever/theme-kit";
import { FaMoon } from "react-icons/fa6";
import { IoSunny } from "react-icons/io5";
import { Backdrop, Overlay } from "@forever/ui-kit";

const SIDEBAR_LINKS = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/collection" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Sidebar = ({ onClose }: { onClose: () => void }) => {
  const { theme, setTheme } = useThemeStore();

  return (
    <Overlay>
      <Backdrop>
        <OutsideClickHandler onOutsideClick={onClose}>
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
              <div
                className={styles.themeButton}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <>
                    Dark
                    <FaMoon size={25} />
                  </>
                ) : (
                  <>
                    Light
                    <IoSunny size={25} />
                  </>
                )}
              </div>
            </div>
            <nav>
              <ul>
                {SIDEBAR_LINKS.map((link, i) => (
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
