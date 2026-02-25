import { AxiosInstance } from "axios";
import { RequestInterceptorItem, ResponseInterceptorItem } from "./types";
import { getLocalStorage, setLocalStorage, removeLocalStorage } from "@forever/storage-kit"

//! REQUEST INTERCEPTORS
const jwtTokenRequestInterceptor: (accessTokenName?: string) => RequestInterceptorItem = (accessTokenName = "accessToken") => ({
    useFunc: (request) => {        
        const accessToken = getLocalStorage(accessTokenName, null);
        
        if (accessToken) {
            request.headers.Authorization = `Bearer ${accessToken}`;
        }
        return request;
    }
})

const customRequestInterceptor = (
    useFunc: RequestInterceptorItem["useFunc"],
    errFunc?: RequestInterceptorItem["errFunc"]) => ({
        useFunc,
        errFunc
    })


//! RESPONSE INTERCEPTORS

const customResponseInterceptor = (
    useFunc: ResponseInterceptorItem["useFunc"],
    errFunc?: ResponseInterceptorItem["errFunc"]) => ({
        useFunc,
        errFunc
    })

const normalizeResponseInterceptor: ResponseInterceptorItem = {
    useFunc: (response) => response.data,
}

const jwtRefreshTokenInterceptor: (
    params: {
        notAgainRequestEndpointsPath?: string[],
        apiInstance: AxiosInstance,
        logoutAction?: () => void,
        accessTokenName?: string
    }) => ResponseInterceptorItem = ({ notAgainRequestEndpointsPath = ["/api/auth/refresh"], apiInstance, logoutAction = () => { }, accessTokenName = "accessToken" }) => ({
        useFunc: response => response,
        errFunc: async (error) => {
            const req = error.config;

            if (
                req &&
                error?.response?.status === 401 &&
                !notAgainRequestEndpointsPath.includes(error.response.data.error.path)
            ) {
                try {
                    const res = await apiInstance.get("/auth/refresh");

                    const accessToken = res.data;

                    setLocalStorage(accessTokenName, accessToken, 1000 * 60 * 60); // 1 hour

                    req.headers.Authorization = `Bearer ${accessToken}`;

                    return apiInstance(req);
                } catch {
                    await apiInstance.get("/auth/logout");
                    removeLocalStorage(accessTokenName);
                    logoutAction()
                }
            }

            return Promise.reject(error);
        }
    })


export {
    jwtRefreshTokenInterceptor,
    normalizeResponseInterceptor,
    customResponseInterceptor,
    customRequestInterceptor,
    jwtTokenRequestInterceptor
}
