import express from "express";
import {
  login,
  loginWithGoogle,
  logout,
  refreshToken,
  register,
  returnSession,
} from "../controller/auth.controller";
import asyncHandler from "express-async-handler";
import { protect } from "../middleware/auth.middleware";
import passport from "passport";

const router = express.Router();

router.post("/register", asyncHandler(register));

router.post("/login", asyncHandler(login));
router.get("/logout", asyncHandler(logout));
router.get("/refresh", asyncHandler(refreshToken));

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt:"select_account" })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.CLIENT_URL + "/auth",
    session: false,
  }),
  asyncHandler(loginWithGoogle)
);

router.get("/session", asyncHandler(protect), asyncHandler(returnSession));
export default router;
