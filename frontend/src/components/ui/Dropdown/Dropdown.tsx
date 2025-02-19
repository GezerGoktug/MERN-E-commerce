import { ReactNode, useState } from "react";
import styles from "./Dropdown.module.scss";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import OutsideClickHandler from "react-outside-click-handler";

type ListItemType = {
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
};

const Dropdown = ({
  className,
  children,
  trigger,
  listItems = [],
  isClickClose = true,
}: {
  trigger?: ReactNode;
  listItems?: ListItemType[];
  isClickClose?: boolean;
  className?: string;
  children?: ReactNode;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClickListItem = (item: ListItemType) => {
    if (isClickClose) setOpen(false);

    if (item.onClick) item.onClick();
  };
  return (
    <div className={clsx(styles.dropdown_wrapper, className)}>
      <div onClick={() => setOpen(!open)} className={styles.dropdown_trigger}>
        {trigger}
      </div>
      <AnimatePresence>
        {open && (
          <OutsideClickHandler
            disabled={!open}
            onOutsideClick={() => setOpen(false)}
            display="contents"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, x: "-50%" }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.1, ease: "linear" }}
              className={styles.dropdown_content}
            >
              {listItems.map((item, i) => (
                <div
                  key={`dropdown_list_${i}`}
                  onClick={() => handleClickListItem(item)}
                  className={styles.dropdown_item}
                >
                  {item.icon}
                  {item.label}
                </div>
              ))}
              {children}
            </motion.div>
          </OutsideClickHandler>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
