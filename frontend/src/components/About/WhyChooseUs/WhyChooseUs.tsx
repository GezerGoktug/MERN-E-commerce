import styles from "./WhyChooseUs.module.scss";

const WhyChooseUs = () => {
  return (
    <div className={styles.why_choose_us_wrapper}>
      <h5>
        WHY <span>CHOOSE US</span>
      </h5>
      <div className={styles.why_choose_us}>
        <div className={styles.why_choose_us_item}>
          <h6>Quality Assurance:</h6>
          <p>
            We meticulously select and vet each product to ensure it meets our
            stringent quality standards.
          </p>
        </div>
        <div className={styles.why_choose_us_item}>
          <h6>Convenience:</h6>
          <p>
            With our user-friendly interface and hassle-free ordering process,
            shopping has never been easier.
          </p>
        </div>
        <div className={styles.why_choose_us_item}>
          <h6>Exceptional Customer Service:</h6>
          <p>
            Our team of dedicated professionals is here to assist you the way,
            ensuring your satisfaction is our top priority.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
