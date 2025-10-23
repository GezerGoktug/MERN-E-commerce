import { IResponse } from "../../types/common.type";
import api from "../../utils/api";
import { IAuthResponse, ILoginVariables, IRegisterVariables } from "../../types/auth.type";
import { IDefaultResponse } from "../../types/common.type";

const logout = (): Promise<IResponse<IDefaultResponse>> => api.get("/auth/logout");

const login = (body: ILoginVariables): Promise<IResponse<IAuthResponse>> => api.post("/auth/login", body);

const register = (body: IRegisterVariables): Promise<IResponse<IAuthResponse>> => api.post("/auth/register", body);

const getSession = (): Promise<IResponse<Omit<IAuthResponse, "accessToken" | "message">>> => api.get("/auth/session");

const AuthService = {
    logout,
    login,
    register,
    getSession
}

export default AuthService;