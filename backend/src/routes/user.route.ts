import express from "express";
import asyncHandler from "express-async-handler";
import rateLimiter from "../util/rate-limiter";
import { protectResetPasswordRequest } from "../middleware/reset-password.middleware";
import {
  evalResetPasswordCodeRequest,
  resetPassword,
  sendResetPasswordRequest,
} from "../controller/user.controller";

const router = express.Router();

router.get("/reset-password-req", asyncHandler(sendResetPasswordRequest));
router.get(
  "/eval-reset-password-code",
  asyncHandler(evalResetPasswordCodeRequest)
);
router.post(
  "/reset-password",
  rateLimiter("reset-password", 8, 1000 * 60 * 5),
  asyncHandler(protectResetPasswordRequest),
  asyncHandler(resetPassword)
);

export default router;
