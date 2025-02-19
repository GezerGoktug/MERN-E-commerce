import styles from "./HeaderLeft.module.scss"

const HeaderLeft = () => {
  return (
    <div className={styles.logo}>
      <img src="/logo.png" alt="" />
    </div>
  );
};

export default HeaderLeft;
