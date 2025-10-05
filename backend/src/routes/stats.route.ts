import express from "express";
import asyncHandler from "express-async-handler";
import { getStatsCardStatictics } from "../controller/stats.controller";
import { checkRole, protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/stats", asyncHandler(protect), asyncHandler(checkRole(["ADMIN"])), asyncHandler(getStatsCardStatictics));

export default router;
