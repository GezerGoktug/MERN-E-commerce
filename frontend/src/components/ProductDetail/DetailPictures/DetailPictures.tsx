import { useState } from "react";
import styles from "./DetailPictures.module.scss";

type DetailPicturesProps = {
  subImages: string[];
  image: string;
};

const DetailPictures = ({ images }: { images: DetailPicturesProps }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <div className={styles.detail_pictures_section}>
      <div className={styles.detail_pictures_section_left}>
        <img
          onClick={() => setActiveImage(images.subImages[0])}
          src={images.subImages[0]}
          alt=""
        />
        <img
          onClick={() => setActiveImage(images.subImages[1])}
          src={images.subImages[1]}
          alt=""
        />
        <img
          onClick={() => setActiveImage(images.subImages[2])}
          src={images.subImages[2]}
          alt=""
        />
        <img
          onClick={() => setActiveImage(images.subImages[3])}
          src={images.subImages[3]}
          alt=""
        />
      </div>
      <div className={styles.detail_pictures_section_right}>
        <img src={activeImage || images.image} alt="" />
      </div>
    </div>
  );
};

export default DetailPictures;
