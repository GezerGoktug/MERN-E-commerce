import { Request, Response } from "express";
import { ErrorHandler } from "../error/errorHandler";
import User from "../models/User.schema";
import RedisClient from "../util/redis-client";
import ResponseHandler from "../util/response";
import bcrypt from "bcryptjs";
import generateUUIDv4 from "../util/uuid";
import { resetPasswordsSchema } from "../validations/schema";
import { sendResetPasswordCodeEmail } from "./mail.controller";

export const sendResetPasswordRequest = async (req: Request, res: Response) => {
  const resetPasswordEmail = (req.query.resetPasswordEmail as string) || "";

  if (
    resetPasswordEmail.trim().length === 0 ||
    !resetPasswordEmail.match(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    )
  ) {
    throw new ErrorHandler(
      400,
      "Reset password email is empty string or invalid format"
    );
  }

  const isFindedAccountWithResetEmail = await User.findOne({
    email: resetPasswordEmail,
  });

  if (!isFindedAccountWithResetEmail) {
    throw new ErrorHandler(
      404,
      "Could be not find account has this reset email"
    );
  }

  const randomNumber = (Math.random() * 1000000).toFixed(0);
  const resetCode =
    randomNumber.length < 6
      ? Array.from({ length: 6 - randomNumber.length }, () => "0")
        .join("")
        .concat(randomNumber)
      : randomNumber;

  await RedisClient.set(
    `reset-code:${isFindedAccountWithResetEmail.email}`,
    resetCode,
    300
  );

  await sendResetPasswordCodeEmail(resetPasswordEmail, resetCode);

  ResponseHandler.success(res, 200, {
    message: "Successfully sended reset code your email",
  });
};

export const evalResetPasswordCodeRequest = async (
  req: Request,
  res: Response
) => {
  const resetPasswordCode = (req.query.resetPasswordCode as string) || "";
  const resetPasswordEmail = (req.query.resetPasswordEmail as string) || "";

  if (resetPasswordCode.trim().length === 0) {
    throw new ErrorHandler(400, "Reset password code cannot be empty string ");
  }

  if (
    resetPasswordEmail.trim().length === 0 ||
    !resetPasswordEmail.match(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    )
  ) {
    throw new ErrorHandler(
      400,
      "Reset password email is empty string or invalid format"
    );
  }

  const val = await RedisClient.get(`reset-code:${resetPasswordEmail}`);

  if (val !== resetPasswordCode)
    throw new ErrorHandler(400, "Wrong reset password code");

  const uid = generateUUIDv4();

  await RedisClient.set(`reset-password-uid:${resetPasswordEmail}`, uid, 600);

  ResponseHandler.success(res, 200, {
    message: "Reset password code is correct",
    token: uid
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { newPassword, resetPasswordEmail } = req.body;

  resetPasswordsSchema.parse({
    password: newPassword,
  });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.findOneAndUpdate(
    { email: resetPasswordEmail },
    {
      password: hashedPassword,
    }
  );

  ResponseHandler.success(res, 200, {
    message: "Successfully updated your password",
  });
};
