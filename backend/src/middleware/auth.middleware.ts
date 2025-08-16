import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ExtendedRequest } from "../types/types";
import { ErrorHandler } from "../error/errorHandler";

export const protect = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers.authorization?.substring(7);

  if (!accessToken) throw new ErrorHandler(401, "Unauthorized");

  const decoded = jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_SECRET as string
  );

  req.user = decoded as JwtPayload;
  next();
};

export const isAdmin = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    throw new ErrorHandler(401, "Unauthorized");
  }
};
