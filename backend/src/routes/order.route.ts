import express from "express";
import asyncHandler from "express-async-handler";
import { isAdmin, protect } from "../middleware/auth.middleware";
import {
  createOrderRoute,
  deleteOrder,
  getAllOrders,
  getMyOrder,
  updateOrder,
} from "../controller/order.controller";

const router = express.Router();

router.put("/:id", asyncHandler(protect), asyncHandler(updateOrder));
router.delete("/:id", asyncHandler(protect), asyncHandler(deleteOrder));
router.post("/add", asyncHandler(protect), asyncHandler(createOrderRoute));
router.get("/my-order", asyncHandler(protect), asyncHandler(getMyOrder));
router.get(
  "/admin/list",
  asyncHandler(protect),
  asyncHandler(isAdmin),
  asyncHandler(getAllOrders)
);

export default router;
