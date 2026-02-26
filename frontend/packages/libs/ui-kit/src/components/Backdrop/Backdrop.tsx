import { type ReactNode } from "react";
import clsx from "clsx";
import styles from "./Backdrop.module.scss"

const Backdrop = ({ children }: { children: ReactNode }) => {
  return (
    <div id="backdrop" className={clsx(styles.backdrop, "backdrop_container")}>
      {children}
    </div>
  );
};

export default Backdrop;
