import api from "@/utils/api";
import type { IAuthResponse, ILoginVariables, IRegisterVariables } from "@/types/auth.type";
import type { IDefaultResponse, IResponse } from "@forever/api";

const logout = (): Promise<IResponse<IDefaultResponse>> => api.get("/auth/logout");

const login = (body: ILoginVariables): Promise<IResponse<IAuthResponse>> => api.post("/auth/login", body);

const register = (body: IRegisterVariables): Promise<IResponse<IAuthResponse>> => api.post("/auth/register", body);

const getSession = (): Promise<IResponse<Omit<IAuthResponse, "accessToken" | "message">>> => api.get("/auth/session");

const loginWithGoogleOAuth = ({ code, redirectUri }: { code: string, redirectUri: string }): Promise<IResponse<IAuthResponse>> => api.post(`/auth/google?code=${code}&redirectUri=${redirectUri}`);

const AuthService = {
    logout,
    login,
    register,
    getSession,
    loginWithGoogleOAuth
}

export default AuthService;