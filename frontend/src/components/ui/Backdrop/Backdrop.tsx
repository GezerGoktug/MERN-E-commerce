import { ReactNode } from "react";
import styles from "./Backdrop.module.scss";
import clsx from "clsx";
const Backdrop = ({ children }: { children: ReactNode }) => {
  return (
    <div id="backdrop" className={clsx(styles.backdrop, "backdrop_container")}>
      {children}
    </div>
  );
};

export default Backdrop;
