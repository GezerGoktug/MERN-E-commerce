import express from "express";
import asyncHandler from "express-async-handler";
import {  getStatsCardStatictics } from "../controller/stats.controller";

const router = express.Router();

router.get("/stats", asyncHandler(getStatsCardStatictics));


export default router;
