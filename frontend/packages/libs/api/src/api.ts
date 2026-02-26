import axios, { type AxiosInstance, type CreateAxiosDefaults } from "axios";
import type { RequestInterceptorItem, ResponseInterceptorItem } from "./types";

export class API {
    private apiInstance: AxiosInstance;

    constructor(baseURL: string, options?: CreateAxiosDefaults) {
        this.apiInstance = axios.create({
            baseURL,
            withCredentials: true,
            ...options
        })
    }

    public initInterceptors(interceptors: {
        reqInterceptors: Array<RequestInterceptorItem>,
        resInterceptors: Array<ResponseInterceptorItem>,
    }) {
        this.setRequestInterceptors(interceptors.reqInterceptors);
        this.setResponseInterceptors(interceptors.resInterceptors);
    }

    private setRequestInterceptors(interceptors: Array<RequestInterceptorItem>) {
        interceptors.reverse().forEach(func => {
            this.apiInstance?.interceptors.request.use(func.useFunc, func.errFunc);
        });
    }

    private setResponseInterceptors(interceptors: Array<ResponseInterceptorItem>) {
        interceptors.forEach(func => {
            this.apiInstance?.interceptors.response.use(func.useFunc, func.errFunc);
        });
    }

    public get instance() {
        return this.apiInstance;
    }
}

