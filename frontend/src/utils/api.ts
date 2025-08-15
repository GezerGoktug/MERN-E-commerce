import axios from "axios";
import { clearUser } from "../store/auth/actions";

const NOT_AGAIN_REQUEST_ENDPOINTS_PATH = ['/api/user/reset-password', '/api/auth/refresh'];

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((request) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`;
  }
  return request;
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const req = error.config;

    if (
      error.response.status === 401 &&
      !NOT_AGAIN_REQUEST_ENDPOINTS_PATH.includes(error.response.data.error.path)
    ) {
      try {
        const res = await api.get("/auth/refresh");

        const accessToken = res.data;

        localStorage.setItem("accessToken", accessToken);

        req.headers.Authorization = `Bearer ${accessToken}`;

        return api(req);
      } catch {
        await api.get("/auth/logout");
        clearUser();
        localStorage.removeItem("accessToken");
        window.location.href = "/auth";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
