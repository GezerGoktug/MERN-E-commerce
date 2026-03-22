import React, { ImgHTMLAttributes } from 'react'
import { getProductionImagePath } from './utils'

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    config?: {
        urlWithAppName?: boolean,
    },
    isDefaultAppNameUrl?: boolean
}

const BaseImage = ({
    config = {
        urlWithAppName: false
    },
    isDefaultAppNameUrl = true,
    src,
    ...props }: ImageProps) => {
    return (
        <img
            src={(
                config.urlWithAppName || isDefaultAppNameUrl
            ) ? typeof src === "string"
                ? getProductionImagePath(src)
                : undefined
                : src
            }
            {...props}
        />
    )
}

export default BaseImage;