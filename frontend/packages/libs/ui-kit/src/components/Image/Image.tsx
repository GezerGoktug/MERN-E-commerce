import clsx from "clsx";
import styles from "./Image.module.scss"
import { type ImgHTMLAttributes, type ReactNode } from "react"
import { useImageLoading } from "@forever/common-utils"

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    placeholder?: ReactNode,
    placeholderImgSrc?: string
    wrapperClassname?: string,
}

const Image = ({ placeholder, placeholderImgSrc, wrapperClassname, className, src, ...props }: ImageProps) => {
    const [loadedSrc, dataLoaded, imageLoaded,error] = useImageLoading(src || "", placeholderImgSrc);
    return (
        <div className={clsx(styles.image_wrapper, { [styles.isImageLoaded]: imageLoaded, [styles.isDataLoaded]: dataLoaded }, wrapperClassname)}>
            {(!error && !imageLoaded) && <div className={styles.image_placeholder}>{placeholder}</div>}
            {(dataLoaded || placeholderImgSrc) && <img
                className={clsx(styles.image, className)}
                src={loadedSrc}
                {...props}
            />
            }
        </div>
    )
}

export default Image;