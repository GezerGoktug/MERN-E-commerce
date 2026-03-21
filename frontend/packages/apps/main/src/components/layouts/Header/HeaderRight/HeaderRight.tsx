import { Link } from "react-router-dom";
import styles from "./HeaderRight.module.scss";
import { RiHeartLine, RiUser3Line } from "react-icons/ri";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { IoSunny } from "react-icons/io5";
import { FaBars, FaMoon } from "react-icons/fa6";
import { useState } from "react";
import Sidebar from "../../Sidebar/Sidebar";
import { AnimatePresence } from "framer-motion";
import { useTotalCartQuantities } from "../../../../store/cart/hooks";
import { isAccess } from "../../../../store/auth/hooks";
import clsx from "clsx";
import { useGetFavProductsCountQuery } from "../../../../services/hooks/queries/product.query";
import { useThemeStore } from "@forever/theme-kit"
import { Tooltip } from "@forever/ui-kit";

const HeaderRight = () => {
  const totalQuantity = useTotalCartQuantities();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useThemeStore();


  const { data } = useGetFavProductsCountQuery([isAccess() ? "favProductEnabled" : "favProductDisabled"], {
    enabled: isAccess(),
  });

  const links = [
    {
      render: (
        <Tooltip message="Change Theme" >
          {
            theme === "dark" ? <FaMoon className={styles.theme_icon} size={25} onClick={() => setTheme("light")} /> : <IoSunny className={styles.theme_icon} size={25} onClick={() => setTheme("dark")} />
          }
        </Tooltip>
      ),
      is_custom_item: true
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
    }
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
        {links.map(({ icon: Icon, href, is_count_badge, menu_icon, badge_data, is_fav_badge, message, is_custom_item, render }, i) => (
          <li key={"header_links_" + i}>
            {menu_icon ? (
              <>
                <Icon
                  onClick={() => setIsOpen(!isOpen)}
                  className={styles.toggle_menu_icon}
                  size={25}
                />
              </>
            ) :
              is_custom_item ? render : (
                href && (
                  <Tooltip message={message}>
                    <Link to={{ pathname: href }}>
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
