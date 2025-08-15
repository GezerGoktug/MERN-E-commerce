import { ReactNode } from "react";
import styles from "./Tooltip.module.scss";
import { IoMdArrowDropup } from "react-icons/io";

const Tooltip = ({
  children,
  message,
}: {
  children: ReactNode;
  message: string;
}) => {
  return (
    <div className={styles.tooltip_wrapper}>
      <div className={styles.tooltip_trigger}>{children}</div>
      <div className={styles.tooltip_content}>
        <IoMdArrowDropup className={styles.tooltip_arrow_icon} size={20} />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Tooltip;
