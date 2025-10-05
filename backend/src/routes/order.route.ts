import express from "express";
import asyncHandler from "express-async-handler";
import { checkRole, protect } from "../middleware/auth.middleware";
import {
  createOrderRoute,
  deleteOrder,
  getAllOrders,
  getMyOrder,
  updateOrder,
} from "../controller/order.controller";

const router = express.Router();

router.put("/:id", asyncHandler(protect), asyncHandler(checkRole(["USER", "ADMIN"])), asyncHandler(updateOrder));
router.delete("/:id", asyncHandler(protect), asyncHandler(checkRole(["USER", "ADMIN"])), asyncHandler(deleteOrder));
router.post("/add", asyncHandler(protect), asyncHandler(checkRole(["USER", "ADMIN"])), asyncHandler(createOrderRoute));
router.get("/my-order", asyncHandler(protect), asyncHandler(checkRole(["USER", "ADMIN"])), asyncHandler(getMyOrder));
router.get(
  "/admin/list",
  asyncHandler(protect),
  asyncHandler(checkRole(["ADMIN"])),
  asyncHandler(getAllOrders)
);

export default router;
