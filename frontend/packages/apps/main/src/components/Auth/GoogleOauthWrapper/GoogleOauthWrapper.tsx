import { useGoogleOauthMutation } from '@/services/hooks/mutations/auth.mutations';
import { setUser } from '@/store/auth/actions';
import { GoogleOAuthPopupProvider } from '@forever/google-oauth-kit';
import { setLocalStorage } from '@forever/storage-kit';
import { type ReactNode } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const GoogleOauthWrapper = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const mutation = useGoogleOauthMutation({
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
        <GoogleOAuthPopupProvider
            onSuccess={async (code) => {
                const redirectUri = `${window.location.origin}${window.location.pathname}`;
                mutation.mutate({ code, redirectUri })
            }}
            onError={(error) => {
                if (typeof error === "string")
                    toast.error(error);
            }}
        >
            {children}
        </GoogleOAuthPopupProvider>
    )
}

export default GoogleOauthWrapper