import { Link, useLocation } from "react-router-dom";
import styles from "./HeaderRight.module.scss";
import { RiUser3Line } from "react-icons/ri";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { FaBars } from "react-icons/fa6";
import { useState } from "react";
import Sidebar from "../../Sidebar/Sidebar";
import { AnimatePresence } from "framer-motion";
import { useTotalCartQuantities } from "../../../../store/cart/hooks";
import Tooltip from "../../../ui/Tooltip/Tooltip";

const HeaderRight = () => {
  const totalQuantity = useTotalCartQuantities();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    {
      icon: IoSearch,
      href: "/collection",
      state: { searchBarOpen: true },
      message: "Search",
      preserveSearch: true
    },
    {
      icon: RiUser3Line,
      href: "/profile",
      message: "Profile",
    },
    {
      icon: HiOutlineShoppingBag,
      href: "/cart",
      cart_icons: true,
      message: "Cart",
    },
    {
      icon: FaBars,
      menu_icon: true,
    },
  ];

  return (
    <nav>
      <AnimatePresence>
        {isOpen && (
          <Sidebar
            onClose={() => {
              setIsOpen(false);
            }}
          />
        )}
      </AnimatePresence>
      <ul className={styles.header_right_links}>
        {links.map(({ icon: Icon, href, state, cart_icons, menu_icon, message, preserveSearch }, i) => (
          <li key={"header_links_" + i}>
            {menu_icon ? (
              <>
                <Icon
                  onClick={() => setIsOpen(!isOpen)}
                  className={styles.toggle_menu_icon}
                  size={25}
                />
              </>
            ) : (
              href && (
                <Tooltip message={message}>
                  <Link
                    to={{
                      pathname: href,
                      search: preserveSearch ? location.search : '',
                    }}
                    state={state}
                  >
                    <Icon size={25} />
                    {cart_icons && (
                      <span className={styles.cart_count_badge}>
                        {totalQuantity}
                      </span>
                    )}
                  </Link>
                </Tooltip>
              )
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default HeaderRight;
