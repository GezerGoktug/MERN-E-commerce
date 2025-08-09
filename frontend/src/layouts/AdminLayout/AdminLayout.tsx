import { Outlet } from "react-router-dom";
import Sidebar from "../../components/layouts/Admin/Sidebar/Sidebar";
import Topbar from "../../components/layouts/Admin/Topbar/Topbar";
import styles from "./AdminLayout.module.scss";
import ThemeButton from "../../components/layouts/ThemeButton/ThemeButton";

const AdminLayout = () => {
  return (
    <div>
      <Topbar />
      <div className={styles.main}>
        <Sidebar />
        <div className={styles.main_content}>
          <Outlet />
        </div>
      </div>
      <ThemeButton />
    </div>
  );
};

export default AdminLayout;
