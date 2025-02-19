import { ReactNode } from "react";
import styles from "./Modal.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import Backdrop from "../Backdrop/Backdrop";
import Overlay from "../Overlay/Overlay";
import OutsideClickHandler from "react-outside-click-handler";
import { MdOutlineClose } from "react-icons/md";

const Modal = ({
  children,
  open,
  closeModal,
}: {
  children: ReactNode;
  open: boolean;
  closeModal: () => void;
}) => {
  return (
    <AnimatePresence>
      {open && (
        <Overlay>
          <Backdrop>
            <div className={styles.modal_wrapper}>
              <OutsideClickHandler
                onOutsideClick={() => closeModal()}
                display="contents"
              >
                <motion.div
                  initial={{ scale: 0.7, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className={styles.modal_content}
                >
                  {children}
                  <MdOutlineClose
                    size={25}
                    className={styles.modal_close_btn}
                    onClick={() => closeModal()}
                  />
                </motion.div>
              </OutsideClickHandler>
            </div>
          </Backdrop>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default Modal;