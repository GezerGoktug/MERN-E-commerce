import { useEffect, useState } from "react"


const useImageLoading = (mainImgSrc: string, placeholderImg?: string): [string, boolean, boolean, boolean] => {

    const [src, setSrc] = useState("");
    const [imageLoaded, setImageLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(false);

        if (placeholderImg)
            setSrc(placeholderImg);


        const img = new Image();
        img.src = mainImgSrc;
        img.onload = () => {
            setSrc(mainImgSrc)
        }
        img.onerror = () => {
            setError(true)
        }
        img.decode()
            .then(() => {
                setImageLoaded(true);
            })
            .catch(() => {
                setError(true);
            })
    }, [mainImgSrc, placeholderImg])

    return [src, src === mainImgSrc, imageLoaded, error];
}

export { useImageLoading }