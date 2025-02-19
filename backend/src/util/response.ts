import { Response } from "express";
import { IError } from "../types/types";

const error = <T>(res: Response, statusCode: number, err: IError<T>) => {
  res.status(statusCode).json({
    statusCode: statusCode,
    success: false,
    error: err,
  });
};

const success = <T>(res: Response, statusCode: number = 200, data: T) => {
  res.status(statusCode).json({
    statusCode,
    success: true,
    data,
  });
};

const ResponseHandler = {
  success: <T>(res: Response, statusCode: number, data: T) =>
    success<T>(res, statusCode, data),
  error: <T>(res: Response, statusCode: number, err: IError<T>) =>
    error<T>(res, statusCode, err),
} as const;

export default ResponseHandler;
