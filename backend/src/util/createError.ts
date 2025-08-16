import { Request } from "express";
import { IError } from "../types/types";

export const createError = <T>(req: Request, errMessage: T): IError<T> => {
  return {
    path: req.path,
    hostName: req.hostname,
    createdAt: new Date(),
    errorMessage: errMessage,
  };
};