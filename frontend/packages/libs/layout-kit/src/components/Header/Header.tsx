import styles from "./Header.module.scss";
import HeaderLeft from "./HeaderLeft/HeaderLeft";
import HeaderCenter from "./HeaderCenter/HeaderCenter";
import HeaderRight, { type HeaderRightProps } from "./HeaderRight/HeaderRight";

const Header = (props: HeaderRightProps) => {
  return (
    <header className={styles.header}>
      <HeaderLeft />
      <HeaderCenter />
      <HeaderRight {...props} />
    </header>
  );
};

export default Header;
