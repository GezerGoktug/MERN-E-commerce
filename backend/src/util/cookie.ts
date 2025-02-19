import { Response } from "express";

export const setCookie = (key: string, value: string, res: Response) => {
  res.cookie(key, value, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 15,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};
