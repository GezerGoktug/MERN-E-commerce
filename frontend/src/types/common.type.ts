import { AxiosError } from "axios";

export interface IDefaultResponse {
    message: string
}


export interface IResponse<T> {
    statusCode: number,
    success: boolean,
    data: T
}

type Error = {
    path: string;
    hostName: string;
    createdAt: Date;
    errorMessage: string | Record<string, string[]>;
}

export type IError = AxiosError<{ error: Error }>;

export interface IPaginationResult<T, OtherDataType> {
    totalPage: number;
    pageSize: number;
    current: number;
    hasNext: boolean;
    hasPrev: boolean;
    content: T[];
    otherData?: OtherDataType;
}