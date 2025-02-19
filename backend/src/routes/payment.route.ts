import express from "express";
import { protect } from "../middleware/auth.middleware";
import { createPayment } from "../controller/payment.controller";
import asyncHandler from "express-async-handler";

const router = express.Router();

router.post("/", asyncHandler(protect), asyncHandler(createPayment));

export default router;
