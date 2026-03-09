import { Link, useLocation } from "react-router-dom";
import styles from "./HeaderRight.module.scss";
import { RiHeartLine, RiUser3Line } from "react-icons/ri";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { IoSearch, IoSunny } from "react-icons/io5";
import { FaBars, FaMoon } from "react-icons/fa6";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useThemeStore } from "@forever/theme-kit";
import { Tooltip } from "@forever/ui-kit";
import Sidebar from "../../Sidebar/Sidebar";

export interface HeaderRightProps {
  cartCount?: number;
  favCount?: number;
  isAuthenticated?: boolean;
}

const HeaderRight = ({
  cartCount = 0,
  favCount = 0,
  isAuthenticated = false,
}: HeaderRightProps) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useThemeStore();

  return (
    <nav>
      <AnimatePresence>
        {isOpen && <Sidebar onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
      <ul className={styles.header_right_links}>
        {/* Search */}
        <li>
          <Tooltip message="Search">
            <Link
              to={{ pathname: "/collection", search: location.search }}
              state={{ searchBarOpen: true }}
            >
              <IoSearch size={25} />
            </Link>
          </Tooltip>
        </li>

        {/* Theme toggle */}
        <li>
          <Tooltip message="Change Theme">
            {theme === "dark" ? (
              <FaMoon
                className={styles.theme_icon}
                size={25}
                onClick={() => setTheme("light")}
              />
            ) : (
              <IoSunny
                className={styles.theme_icon}
                size={25}
                onClick={() => setTheme("dark")}
              />
            )}
          </Tooltip>
        </li>

        {/* Profile */}
        <li>
          <Tooltip message="Profile">
            <Link to="/profile">
              <RiUser3Line size={25} />
            </Link>
          </Tooltip>
        </li>

        {/* Favourites */}
        <li>
          <Tooltip message="Favourite">
            <Link to={isAuthenticated ? "/favourite" : "/auth"}>
              <RiHeartLine size={25} />
              <span
                className={clsx(
                  styles.header_right_badge,
                  styles.is_fav_badge
                )}
              >
                {favCount}
              </span>
            </Link>
          </Tooltip>
        </li>

        {/* Cart */}
        <li>
          <Tooltip message="Cart">
            <Link to="/cart">
              <HiOutlineShoppingBag size={25} />
              <span className={styles.header_right_badge}>{cartCount}</span>
            </Link>
          </Tooltip>
        </li>

        {/* Menu (mobile) */}
        <li>
          <FaBars
            onClick={() => setIsOpen(!isOpen)}
            className={styles.toggle_menu_icon}
            size={25}
          />
        </li>
      </ul>
    </nav>
  );
};

export default HeaderRight;
