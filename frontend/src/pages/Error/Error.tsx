import { IoChevronBackCircle } from "react-icons/io5";
import styles from "./Error.module.scss";
import Button from "../../components/ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Error = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.error}>
      <Helmet>
        <title>Error - Forever</title>
      </Helmet>
      <h5>404</h5>
      <h6>Error</h6>
      <p>Page not founded</p>
      <Button
        onClick={() => navigate(isAdmin ? "/admin/stats" : "/")}
        leftIcon={IoChevronBackCircle}
      >
        {isAdmin ? "Return admin main page" : "Return home page"}
      </Button>
    </div>
  );
};

export default Error;
