import express from "express";
import { checkRole, protect } from "../middleware/auth.middleware";
import { createPaymentIntent } from "../controller/payment.controller";
import asyncHandler from "express-async-handler";

const router = express.Router();

router.post(
  "/intent",
  asyncHandler(protect),
  asyncHandler(checkRole(["USER", "ADMIN"])),
  asyncHandler(createPaymentIntent)
);

export default router;
