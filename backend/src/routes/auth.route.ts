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
import { checkRole, protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", asyncHandler(register));

router.post("/login", asyncHandler(login));
router.get("/logout", asyncHandler(logout));
router.get("/refresh", asyncHandler(refreshToken));

router.post(
  "/google",
  asyncHandler(loginWithGoogle)
);

router.get("/session", asyncHandler(protect), asyncHandler(checkRole(["USER", "ADMIN"])), asyncHandler(returnSession));
export default router;
