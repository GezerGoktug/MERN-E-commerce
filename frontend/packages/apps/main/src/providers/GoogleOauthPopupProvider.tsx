import { useLoginGoogleOauthMutation } from '@/services/hooks/mutations/auth.mutations';
import { setUser } from '@/store/auth/actions';
import { GoogleOAuthPopupProvider as GoogleOauthPopupListenerProvider, useGoogleOauth } from '@forever/google-oauth-kit';
import { setLocalStorage } from '@forever/storage-kit';
import { Loading } from '@forever/ui-kit';
import { type ReactNode } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LoginGoogleOauthLoading = () => {
    const { loading } = useGoogleOauth();
    return (
        <>
            {loading && <Loading loadingText={
                <>
                    Please wait.<br />
                    Login with Google process is ongoing.
                </>
            }
            />}
        </>
    )
}

const GoogleOAuthPopupProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const mutation = useLoginGoogleOauthMutation({
        onSuccess(data) {
            if (data.data.accessToken) {
                setLocalStorage("accessToken", data.data.accessToken as string, 1000 * 60 * 60);
            } else return;
            setUser(data.data.user);
            setTimeout(() => {
                navigate("/profile");
                toast.success("Login with Google succesfully");
            }, 1000);
        },
        onError(error) {
            const apiError = error?.response?.data?.error.errorMessage;
            if (typeof apiError === "string") toast.error(apiError);
        },
    });

    return (
        <GoogleOauthPopupListenerProvider
            onSuccess={async (code) => {
                const redirectUri = `${window.location.origin}${window.location.pathname}`;
                await mutation.mutateAsync({ code, redirectUri }).catch(() => { })
            }}
            onError={(error) => {
                if (typeof error === "string")
                    toast.error(error);
            }}
        >
            <LoginGoogleOauthLoading />
            {children}
        </GoogleOauthPopupListenerProvider>
    )
}

export default GoogleOAuthPopupProvider