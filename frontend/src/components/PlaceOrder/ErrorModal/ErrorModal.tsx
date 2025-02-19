import OutsideClickHandler from "react-outside-click-handler";
import Backdrop from "../../ui/Backdrop/Backdrop";
import Overlay from "../../ui/Overlay/Overlay";
import styles from "./ErrorModal.module.scss";
import { MdOutlineError } from "react-icons/md";
import Button from "../../ui/Button/Button";
import { FaXmark } from "react-icons/fa6";
import { motion } from "framer-motion";
import { FieldErrors } from "react-hook-form";

const ErrorModal = ({
  closeModal,
  errors,
}: {
  closeModal: () => void;
  errors: FieldErrors;
}) => {
  return (
    <Overlay>
      <Backdrop>
        <OutsideClickHandler
          display="contents"
          onOutsideClick={() => closeModal()}
        >
          <div className={styles.error_modal_wrapper}>
            <motion.div
              exit={{ scale: 0.5, opacity: 0.2 }}
              transition={{ duration: 0.25 }}
              initial={{ scale: 0.5, opacity: 0.2 }}
              animate={{ scale: 1, opacity: 1 }}
              className={styles.error_modal_container}
            >
              <MdOutlineError className={styles.error_modal_icon} size={100} />
              <h6>Error</h6>
              <div className={styles.errors}>
                {Object.values(errors).map((error, i) => (
                  <span key={"error_" + i} className={styles.error_article}>
                    <span className={styles.dot_icon}>&#9679;</span>{" "}
                    {error?.message as string} <br />
                  </span>
                ))}
              </div>
              <Button
                onClick={() => closeModal()}
                rightIconSize={15}
                rightIcon={FaXmark}
                className={styles.error_modal_btn}
                variant="danger"
              >
                CLOSE
              </Button>
            </motion.div>
          </div>
        </OutsideClickHandler>
      </Backdrop>
    </Overlay>
  );
};

export default ErrorModal;
