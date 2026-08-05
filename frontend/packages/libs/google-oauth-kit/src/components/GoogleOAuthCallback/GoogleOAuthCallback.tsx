import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { BiLoader } from "react-icons/bi";
import styles from "./GoogleOAuthCallback.module.scss";

interface IGoogleOauthData {
    type: string;
    code?: string;
    error?: string;
}

const GoogleOAuthCallback = () => {
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get("code");
        const error = queryParams.get("error");
        const state = queryParams.get("state");

        if (window.opener) {
            if (code) {
                window.opener.postMessage(
                    { type: "GOOGLE_AUTH_CODE", code, state } as IGoogleOauthData,
                    window.location.origin
                );
            } else if (error) {
                window.opener.postMessage(
                    { type: "GOOGLE_AUTH_ERROR", error } as IGoogleOauthData,
                    window.location.origin
                );
            }
            window.close();
        }
    }, []);

    return (
        <div className={styles.callback_wrapper}>
            <div className={styles.callback_card}>
                <FcGoogle size={64} />
                <BiLoader size={32} className={styles.callback_spinner} />
                <h3 className={styles.callback_title}>Please wait...</h3>
                <p className={styles.callback_subtitle}>Completing your sign-in</p>
            </div>
        </div>
    );
};

export default GoogleOAuthCallback;
