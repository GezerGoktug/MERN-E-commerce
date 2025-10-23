import { MdOutlineMail } from "react-icons/md";
import styles from "./ProfileOverview.module.scss";
import { FaClockRotateLeft } from "react-icons/fa6";
import Button from "../../ui/Button/Button";
import { CiLogout } from "react-icons/ci";
import { useAccount } from "../../../store/auth/hooks";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../../store/auth/actions";
import { useLogoutMutation } from "../../../services/hooks/mutations/auth.mutations";

const ProfileOverview = () => {
  dayjs.extend(relativeTime);
  const user = useAccount();
  const navigate = useNavigate();

  const { mutate } = useLogoutMutation({
    onSuccess: () => {
      clearUser();
      navigate("/");
      localStorage.removeItem("accessToken");
      toast.success("Logout succesfully");
    },
  })

  return (
    <div className={styles.profile_overview_wrapper}>
      <img src={user?.image} alt="" />
      <div className={styles.profile_overview}>
        <h6>{user?.name}</h6>
        <div className={styles.profile_overview_feature}>
          <MdOutlineMail
            size={35}
            className={styles.profile_overview_feature_icon}
          />
          <p>{user?.email}</p>
        </div>
        <div className={styles.profile_overview_feature}>
          <FaClockRotateLeft
            size={35}
            className={styles.profile_overview_feature_icon}
          />
          <p>Last logged in : {dayjs(user?.lastLoggedIn).fromNow()}</p>
        </div>
        <Button
          onClick={() => mutate()}
          className={styles.log_out_btn}
          size="sm"
          rightIcon={CiLogout}
          rightIconSize={25}
          variant="danger"
        >
          Log out
        </Button>
      </div>
    </div>
  );
};

export default ProfileOverview;
