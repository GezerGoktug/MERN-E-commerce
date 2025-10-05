import express from "express";
import { checkRole, protect } from "../middleware/auth.middleware";
import { createPayment } from "../controller/payment.controller";
import asyncHandler from "express-async-handler";

const router = express.Router();

router.post("/", asyncHandler(protect), asyncHandler(checkRole(["USER", "ADMIN"])), asyncHandler(createPayment));

export default router;
