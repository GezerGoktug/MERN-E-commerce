import { Link, useLocation } from "react-router-dom";
import styles from "./HeaderRight.module.scss";
import { RiHeartLine, RiUser3Line } from "react-icons/ri";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { FaBars } from "react-icons/fa6";
import { useState } from "react";
import Sidebar from "../../Sidebar/Sidebar";
import { AnimatePresence } from "framer-motion";
import { useTotalCartQuantities } from "../../../../store/cart/hooks";
import Tooltip from "../../../ui/Tooltip/Tooltip";
import { useQuery } from "@tanstack/react-query";
import api from "../../../../utils/api";
import { isAccess } from "../../../../store/auth/hooks";
import clsx from "clsx";

const HeaderRight = () => {
  const totalQuantity = useTotalCartQuantities();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['favProductCount', isAccess()],
    queryFn: () => api.get(`/product/favourites/count`),
    enabled: isAccess()
  })

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
      icon: RiHeartLine,
      href: "/favourite",
      message: "Favourite",
      badge_data: data?.data.count || 0,
      is_count_badge: true,
      is_fav_badge: true,
    },
    {
      icon: HiOutlineShoppingBag,
      href: "/cart",
      is_count_badge: true,
      badge_data: totalQuantity,
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
        {links.map(({ icon: Icon, href, state, is_count_badge, menu_icon, badge_data, is_fav_badge, message, preserveSearch }, i) => (
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
                    {is_count_badge && (
                      <span className={clsx(styles.header_right_badge, { [styles.is_fav_badge]: is_fav_badge })}>
                        {badge_data}
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
