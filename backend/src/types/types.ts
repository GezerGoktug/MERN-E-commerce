import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface ExtendedRequest extends Request {
  user?: JwtPayload | string;
  browserId?: string
}

export interface IError<T> {
  path: string;
  hostName: string;
  createdAt: Date;
  errorMessage: T;
}

export type SizeType = "SMALL" | "MEDIUM" | "LARGE" | "XLARGE" | "XXLARGE";

export interface CartProductType {
  _id: string;
  size: SizeType;
  price: number;
  quantity: number;
  name: string;
  image: string;
}
