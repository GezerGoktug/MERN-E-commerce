import api from "../api/api.config";
import type { IAuthResponse, ILoginVariables, IRegisterVariables } from "../../domain/entities/auth.entity";
import type { IDefaultResponse, IResponse } from "@forever/api";

const logout = (): Promise<IResponse<IDefaultResponse>> => api.get("/auth/logout");

const login = (body: ILoginVariables): Promise<IResponse<IAuthResponse>> => api.post("/auth/login", body);

const register = (body: IRegisterVariables): Promise<IResponse<IAuthResponse>> => api.post("/auth/register", body);

const getSession = (): Promise<IResponse<Omit<IAuthResponse, "accessToken" | "message">>> => api.get("/auth/session");

const AuthRepository = { logout, login, register, getSession };

export default AuthRepository;