import { useNavigate } from "react-router-dom";
import styles from "./Topbar.module.scss";
import { Button } from "@forever/ui-kit";
import { FaBars } from "react-icons/fa6";
import { useState } from "react";
import MobileAside from "../MobileAside/MobileAside";
import { AnimatePresence } from "framer-motion";
import Logo from "../../../common/Logo/Logo";
import { useLogoutMutation } from "../../../../services/hooks/mutations/auth.mutations";
import toast from "react-hot-toast";
import { removeLocalStorage } from "@forever/storage-kit";
import { clearUser } from "../../../../store/auth/actions";

const Topbar = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const navigate = useNavigate();

  const { mutate, isPending } = useLogoutMutation({
    onSuccess() {
      clearUser();
      navigate("/admin/login");
      removeLocalStorage("accessToken");
      toast.success("Logout succesfully");
    },
  })

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
          <Logo isAdminLogo/>
        </div>
        <Button
          onClick={() => mutate()}
          size="sm"
          className={styles.topbar_logout_btn}
          loading={isPending}
        >
          Log out
        </Button>
      </div>
    </div>
  );
};

export default Topbar;
