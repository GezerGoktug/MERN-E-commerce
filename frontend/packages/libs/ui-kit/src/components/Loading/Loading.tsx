import { type ReactNode } from 'react'
import Overlay from '../Overlay/Overlay'
import styles from './Loading.module.scss'
import { BiLoader } from 'react-icons/bi'
import Backdrop from '../Backdrop/Backdrop'

const Loading = ({ loadingContent }: { loadingContent?: ReactNode }) => {
    return (
        <Overlay>
            <Backdrop>
                <div className={styles.loading_wrapper}>
                    {loadingContent || <BiLoader size={80} className={styles.loading_icon} />}
                </div>
            </Backdrop>
        </Overlay>
    )
}

export default Loading