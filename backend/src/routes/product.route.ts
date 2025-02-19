import express from "express";
import asyncHandler from "express-async-handler";
import {
  getProductsByQueries,
  getProductDetail,
  createComment,
  addProduct,
  deleteProduct,
  updateProduct,
  deleteComment,
  updateComment,
  getProductsForAdmin,
  getLatestCollections,
  getBestSellerProducts,
} from "../controller/product.controller";
import { isAdmin, protect } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";

const router = express.Router();

router.post(
  "/add",
  asyncHandler(protect),
  asyncHandler(isAdmin),
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImage1", maxCount: 1 },
    { name: "subImage2", maxCount: 1 },
    { name: "subImage3", maxCount: 1 },
  ]),
  asyncHandler(addProduct)
);
router.get("/list", asyncHandler(getProductsByQueries));
router.get("/latest-products/list", asyncHandler(getLatestCollections));
router.get("/best-seller-products/list", asyncHandler(getBestSellerProducts));
router.get("/admin/list", asyncHandler(getProductsForAdmin));
router.delete(
  "/:id",
  asyncHandler(protect),
  asyncHandler(isAdmin),
  asyncHandler(deleteProduct)
);
router.put(
  "/:id",
  asyncHandler(protect),
  asyncHandler(isAdmin),
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImage1", maxCount: 1 },
    { name: "subImage2", maxCount: 1 },
    { name: "subImage3", maxCount: 1 },
  ]),
  asyncHandler(updateProduct)
);
router.post("/comment/add", asyncHandler(protect), asyncHandler(createComment));
router.put("/comment/:id", asyncHandler(protect), asyncHandler(updateComment));
router.delete(
  "/:productId/comment/:commentId",
  asyncHandler(protect),
  asyncHandler(deleteComment)
);
router.get("/:id", asyncHandler(getProductDetail));

export default router;
