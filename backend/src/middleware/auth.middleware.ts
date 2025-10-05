import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ExtendedRequest, Role } from "../types/types";
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

  if (!decoded) throw new ErrorHandler(401, "Unauthorized");

  req.user = decoded as JwtPayload;
  next();
};

export const checkRole = (
  roles: Role[]
) => (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
    if (req.user && roles.includes((req.user as JwtPayload).role)) {
      next();
    } else {
      throw new ErrorHandler(401, "Unauthorized");
    }
  }
