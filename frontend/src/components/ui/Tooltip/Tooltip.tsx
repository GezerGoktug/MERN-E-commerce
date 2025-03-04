import { ReactNode } from "react";
import styles from "./Tooltip.module.scss";

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
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Tooltip;
