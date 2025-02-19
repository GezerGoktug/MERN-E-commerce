import styles from "./AboutUs.module.scss";

const AboutUs = () => {
  return (
    <div className={styles.about_wrapper}>
      <h5>
        ABOUT <span>US</span>
      </h5>
      <div className={styles.about}>
        <img src="/about_img.png" alt="" />
        <div className={styles.about_content}>
          <p className={styles.about_desc_1}>
            Forever was born out of a passion for innovation and a desire to
            revolutionize the way people shop online. Our journey began with a
            simple idea: to provide a platform where customers can easily
            discover, explore, and purchase a wide range of products from the
            comfort of their homes.
            <br />
            <br />
            Since our inception, we've worked tirelessly to curate a diverse
            selection of high-quality products that cater to every taste and
            preference. From fashion and beauty to electronics and home
            essentials, we offer an extensive collection sourced from trusted
            brands and suppliers.
          </p>
          <h6>Our Mission</h6>
          <p className={styles.about_desc_2}>
            Our mission at Forever is to empower customers with choice,
            convenience, and confidence. We're dedicated to providing a seamless
            shopping experience that exceeds expectations, from browsing and
            ordering to delivery and beyond.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
