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
  getFavouriteProducts,
  addFavouriteProduct,
  removeFavouriteProduct,
  getIsProductInFavourites,
  getFavProductLength,
  getIsFavouriteByProductId,
} from "../controller/product.controller";
import { checkRole, protect } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";
import rateLimiter from "../util/rate-limiter";
import {
  cacheable,
  createDynamicVariables,
} from "../middleware/cache.middleware";

const router = express.Router();

router.post(
  "/add",
  asyncHandler(protect),
  asyncHandler(checkRole(["ADMIN"])),
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImage1", maxCount: 1 },
    { name: "subImage2", maxCount: 1 },
    { name: "subImage3", maxCount: 1 },
  ]),
  asyncHandler(addProduct)
);
router.get(
  "/list",
  rateLimiter("product-list"),
  cacheable(
    "product-list",
    createDynamicVariables(
      [],
      [
        "page",
        "pageSize",
        "sortType",
        "sortField",
        "categories",
        "subCategory",
        "searchQuery",
        "minPrice",
      ]
    ),
    true
  ),
  asyncHandler(getProductsByQueries)
);
router.get("/latest-products/list", asyncHandler(getLatestCollections));
router.get("/best-seller-products/list", asyncHandler(getBestSellerProducts));
router.get("/admin/list", asyncHandler(protect), checkRole(["ADMIN"]), asyncHandler(getProductsForAdmin));
router.delete(
  "/:id",
  asyncHandler(protect),
  asyncHandler(checkRole(["ADMIN"])),
  asyncHandler(deleteProduct)
);
router.put(
  "/:id",
  asyncHandler(protect),
  asyncHandler(checkRole(["ADMIN"])),
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImage1", maxCount: 1 },
    { name: "subImage2", maxCount: 1 },
    { name: "subImage3", maxCount: 1 },
  ]),
  asyncHandler(updateProduct)
);
router.post("/comment/add", asyncHandler(protect), asyncHandler(checkRole(["USER", "ADMIN"])), asyncHandler(createComment));
router.put("/comment/:id", asyncHandler(protect), asyncHandler(checkRole(["USER", "ADMIN"])), asyncHandler(updateComment));
router.delete(
  "/:productId/comment/:commentId",
  asyncHandler(protect),
  asyncHandler(checkRole(["USER", "ADMIN"])),
  asyncHandler(deleteComment)
);
router.get(
  "/:id",
  rateLimiter("product-detail", 10, 1000 * 60 * 1.5), // 1.5 minutes
  cacheable("product-detail", createDynamicVariables(["id"]), true),
  asyncHandler(getProductDetail)
);

router.get(
  '/favourites/list',
  asyncHandler(protect),
  asyncHandler(checkRole(["USER", "ADMIN"])),
  cacheable('favProducts', createDynamicVariables([], [
    "page",
    "pageSize",
    "sortType",
    "sortField",
    "categories",
    "subCategory",
    "searchQuery",
  ], []),
    true
  ),
  asyncHandler(getFavouriteProducts)
)

router.post('/favourites/add', asyncHandler(protect), asyncHandler(checkRole(["USER", "ADMIN"])), asyncHandler(addFavouriteProduct))
router.delete('/favourites/:productId', asyncHandler(protect), asyncHandler(checkRole(["USER", "ADMIN"])), asyncHandler(removeFavouriteProduct))
router.post('/favourites/isProductInFav', asyncHandler(protect), asyncHandler(checkRole(["USER", "ADMIN"])), asyncHandler(getIsProductInFavourites))
router.get('/favourites/count', asyncHandler(protect), asyncHandler(checkRole(["USER", "ADMIN"])), asyncHandler(getFavProductLength))
router.get('/favourites/:id', asyncHandler(protect), asyncHandler(checkRole(["USER", "ADMIN"])), asyncHandler(getIsFavouriteByProductId))

export default router;
