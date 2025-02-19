import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import ResponseHandler from "../util/response";
import { ErrorHandler } from "../error/errorHandler";
import { createError } from "../util/createError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  
  if (err instanceof ErrorHandler) {
    ResponseHandler.error(
      res,
      err.statusCode,
      createError<string>(req, err.message)
    );
    return;
  }

  if (err instanceof ZodError) {
    ResponseHandler.error(
      res,
      400,
      createError(req, err.flatten().fieldErrors)
    );
    return;
  }

  if (err.name === "CastError") {
    ResponseHandler.error(
      res,
      404,
      createError<string>(req, "No record exist. Invalid Id")
    );
    return;
  }

  if (err.name === "ValidationError") {
    const validationErrors: Record<string, string[]> = {};
    Object.keys((err as any).errors).forEach((key) => {
      validationErrors[key] = [(err as any).errors[key].message];
    });

    ResponseHandler.error(
      res,
      400,
      createError<Record<string, string[]>>(req, validationErrors)
    );
    return;
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    ResponseHandler.error(
      res,
      401,
      createError<string>(req, "Invalid or expired token")
    );
    return;
  }
  ResponseHandler.error(
    res,
    500,
    createError<string>(req, "Internal server error")
  );
};
