import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import { IoAddCircleOutline } from "react-icons/io5";
import clsx from "clsx";
import { IoIosList, IoIosStats } from "react-icons/io";
import { AiOutlineProduct } from "react-icons/ai";

const Sidebar = ({ isMobileAside = false }: { isMobileAside?: boolean }) => {
  const links = [
    {
      icon: IoIosStats,
      href: "/admin/stats",
      label: "Stats",
    },
    {
      icon: AiOutlineProduct,
      href: "/admin/products",
      label: "Products",
    },
    {
      icon: IoAddCircleOutline,
      href: "/admin/add-product",
      label: "Add Product",
    },
    {
      icon: IoIosList,
      href: "/admin/orders",
      label: "Orders",
    },
  ];

  return (
    <div
      className={clsx(styles.sidebar, { [styles.mobile_aside]: isMobileAside })}
    >
      <nav>
        <ul>
          {links.map(({ icon: Icon, href, label }, i) => (
            <li key={"admin_link" + i}>
              <NavLink
                className={({ isActive }) =>
                  clsx(styles.nav_link, { [styles.active]: isActive })
                }
                to={href}
              >
                <Icon size={25} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
