import User from "../models/User.schema";
import { Request, Response } from "express";
import { schema } from "../validations/schema";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ExtendedRequest } from "../types/types";
import ResponseHandler from "../util/response";
import { generateAccessToken, generateRefreshToken } from "../util/token";
import { setCookie } from "../util/cookie";
import { ErrorHandler } from "../error/errorHandler";

const generateRandomAvatar = () => {
  const randomAvatar = Math.floor(Math.random() * 71);
  return `https://i.pravatar.cc/300?img=${randomAvatar}`;
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password, confirmPassword } = req.body;

  schema.parse({
    name,
    email,
    password,
    confirmPassword,
  });

  const existEmail = await User.findOne({ email: email });

  if (existEmail) throw new ErrorHandler(400, "This email is already in use");

  const users = await User.find();

  const promises = users.map(async (user) => {
    if (user.password === null) {
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (isMatch) {
      throw new ErrorHandler(400, "This password is already in use");
    }
  });

  await Promise.all(promises);

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name: name,
    email: email,
    password: hashedPassword,
    image: generateRandomAvatar(),
  });

  await newUser.save();

  const accessToken = generateAccessToken({
    userId: newUser._id,
    email: newUser.email,
    role: newUser.role,
  });

  const refreshToken = generateRefreshToken({
    userId: newUser._id,
    email: newUser.email,
    role: newUser.role,
  });

  setCookie("token",refreshToken,res)

  ResponseHandler.success(res, 200, {
    message: "Register successful",
    user: {
      email: newUser.email,
      name: newUser.name,
      lastLoggedIn: newUser.lastLoggedIn,
      role: newUser.role,
      image: newUser.image,
    },
    accessToken,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email.trim().length === 0 && password.trim().length === 0)
    throw new ErrorHandler(400, "Password and email required");

  const existUser = await User.findOne({ email: email });

  if (!existUser) throw new ErrorHandler(400, "Invalid email or password");

  const isMatch = await bcrypt.compare(password, existUser.password as string);

  if (!isMatch) throw new ErrorHandler(400, "Invalid email or password");

  const lastLoggedIn = new Date();

  await User.findByIdAndUpdate(existUser._id, { lastLoggedIn });

  const accessToken = generateAccessToken({
    userId: existUser._id,
    email: existUser.email,
    role: existUser.role,
  });

  const refreshToken = generateRefreshToken({
    userId: existUser._id,
    email: existUser.email,
    role: existUser.role,
  });
  setCookie("token",refreshToken,res)


  ResponseHandler.success(res, 200, {
    message: "Login successful",
    user: {
      email: existUser.email,
      name: existUser.name,
      lastLoggedIn: existUser.lastLoggedIn,
      role: existUser.role,
      image: existUser.image,
    },
    accessToken,
  });
};

export const logout = async (req: ExtendedRequest, res: Response) => {
  res.clearCookie("token");

  ResponseHandler.success(res, 200, { message: "Logout successfully" });
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.token;

  if (!refreshToken) throw new ErrorHandler(401, "Unauthorized");

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET as string
  ) as JwtPayload;

  const accessToken = generateAccessToken({
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  });

  const newRefreshToken = generateRefreshToken({
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  });

  setCookie("token",newRefreshToken,res)


  ResponseHandler.success(res, 200, accessToken);
};

export const returnSession = async (req: ExtendedRequest, res: Response) => {
  const user = await User.findById((req?.user as JwtPayload).userId);

  ResponseHandler.success(res, 200, {
    user: {
      email: user?.email,
      name: user?.name,
      lastLoggedIn: user?.lastLoggedIn,
      role: user?.role,
      image: user?.image,
    },
  });
};

export const loginWithGoogle = async (req: ExtendedRequest, res: Response) => {
  if (!req.user) throw new ErrorHandler(401, "Unauthorized");

  const accessToken = generateAccessToken({
    userId: (req.user as JwtPayload).userId,
    email: (req.user as JwtPayload).email,
    role: (req.user as JwtPayload).role,
  });

  const refreshToken = generateRefreshToken({
    userId: (req.user as JwtPayload).userId,
    email: (req.user as JwtPayload).email,
    role: (req.user as JwtPayload).role,
  });
  
  setCookie("token",refreshToken,res)

  res.redirect(
    (process.env.CLIENT_URL as string) +
      `/auth?google_login=true&accessToken=${accessToken}`
  );
};
