import { NextFunction, Request, Response } from "express";
import { Product } from "../models/Product.schema";
import { ExtendedRequest } from "../types/types";
import { JwtPayload } from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import ResponseHandler from "../util/response";
import { ErrorHandler } from "../error/errorHandler";
import { Order } from "../models/Order.schema";
import { productSchema } from "../validations/schema";
import { pageableToResponse } from "../util/pagination";
import {
  cacheEvict,
  createDynamicVariables,
  setCache,
  updateCache,
} from "../middleware/cache.middleware";

const getSortingStatusToProducts = (
  sorting: string
): Record<string, number> => {
  switch (sorting) {
    case "LOW_TO_HIGH":
      return { price: 1 };
    case "HIGH_TO_LOW":
      return { price: -1 };
    case "DEFAULT":
      return { _id: 1 };
    default:
      return { _id: 1 };
  }
};
const getPublicIdFromUrl = (url: string): string | null => {
  const regex = /\/upload\/(?:v\d+\/)?([^\.]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const addProduct = async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const { name, price, description, sizes, category, subCategory } = req.body;

  const mainImg = files?.mainImage && files?.mainImage[0];
  const subImg1 = files?.subImage1 && files?.subImage1[0];
  const subImg2 = files?.subImage2 && files?.subImage2[0];
  const subImg3 = files?.subImage3 && files?.subImage3[0];

  productSchema.parse({
    subCategory,
    category,
    name,
    price: +price,
    description,
    sizes: JSON.parse(sizes),
    mainImage: mainImg,
    subImage1: subImg1,
    subImage2: subImg2,
    subImage3: subImg3,
  });

  if (!mainImg) {
    throw new ErrorHandler(400, "Required main image for product.");
  }

  const images = [mainImg, subImg1, subImg2, subImg3].filter(
    (item) => item !== undefined
  );

  const [mainImage, subImage1, subImage2, subImage3] = await Promise.all(
    images.map(async (img) => {
      const result = await cloudinary.uploader.upload(img?.path, {
        resource_type: "image",
        folder: "mern-e-commerce-products-images",
        unique_filename: true,
      });
      result;
      return result.secure_url || "";
    })
  );

  const newProduct = new Product({
    name,
    price: +price,
    description,
    sizes: JSON.parse(sizes),
    category,
    subCategory,
    image: mainImage,
    subImages: [mainImage, subImage1, subImage2, subImage3].map((img) =>
      img ? img : ""
    ),
  });

  await newProduct.save();

  ResponseHandler.success(res, 200, { message: "Added product successfully" });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;

  const product = await Product.findById(id);

  const images = product?.subImages === undefined ? [] : product.subImages;

  await Promise.all(
    images.map(async (img) => {
      if (img.trim().length === 0) return;

      await cloudinary.uploader.destroy(getPublicIdFromUrl(img) || "");
    })
  );

  await Product.findByIdAndDelete(id);

  ResponseHandler.success(res, 200, { message: "Deleted product succesfully" });
};

export const updateProduct = async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const { name, price, description, sizes, category, subCategory } = req.body;

  const id = req.params.id;

  const mainImg = files?.mainImage && files?.mainImage[0];
  const subImg1 = files?.subImage1 && files?.subImage1[0];
  const subImg2 = files?.subImage2 && files?.subImage2[0];
  const subImg3 = files?.subImage3 && files?.subImage3[0];

  productSchema.parse({
    subCategory,
    category,
    name,
    price: +price,
    description,
    sizes: JSON.parse(sizes),
    mainImage: mainImg,
    subImage1: subImg1,
    subImage2: subImg2,
    subImage3: subImg3,
  });

  const product = await Product.findById(id);

  const subImages = product?.subImages === undefined ? [] : product?.subImages;

  const images = [mainImg, subImg1, subImg2, subImg3];

  const [mainImage, subImage1, subImage2, subImage3] = await Promise.all(
    images.map(async (img, i) => {
      if (img !== undefined) {
        if (subImages[i].trim().length === 0) {
          const result = await cloudinary.uploader.upload(img?.path, {
            resource_type: "image",
            folder: "mern-e-commerce-products-images",
            unique_filename: true,
          });
          result;
          return result.secure_url || "";
        }
        const result = await cloudinary.uploader.upload(img?.path, {
          overwrite: true,
          public_id: `${getPublicIdFromUrl(subImages[i])}`,
          invalidate: true,
        });
        result;
        return result.secure_url || "";
      }
      return subImages[i];
    })
  );

  await Product.findByIdAndUpdate(id, {
    name,
    price: +price,
    description,
    sizes: JSON.parse(sizes),
    category,
    subCategory,
    image: mainImage,
    subImages: [mainImage, subImage1, subImage2, subImage3].sort((a, b) =>
      a === "" ? 1 : b === "" ? -1 : 0
    ),
  });

  ResponseHandler.success(res, 200, {
    message: "Updated product successfully",
  });
};

export const getProductsForAdmin = async (req: Request, res: Response) => {
  const page = req.query.page || "0";
  const limit = 15;
  const skip = Number(page) * 15;

  const products = await Product.find().limit(limit).skip(skip);

  const productsCount = await Product.countDocuments();

  ResponseHandler.success(
    res,
    200,
    pageableToResponse(productsCount, Number(page), products)
  );
};

export const getProductsByQueries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = req.query.page || "0";
  const categories = req.query.categories || "";
  const subCategory = req.query.subCategory || "";
  const sorting = req.query.sorting || "DEFAULT";
  const searchQuery = req.query.searchQuery || "";

  const limit = 15;
  const skip = Number(page) * 15;

  const filterCategory = Array.isArray(categories)
    ? { category: { $in: categories } }
    : (categories as string).trim().length === 0
    ? {}
    : { category: { $in: categories } };

  const filterSubCategory = Array.isArray(subCategory)
    ? { subCategory: { $in: subCategory } }
    : (subCategory as string).trim().length === 0
    ? {}
    : { subCategory: { $in: subCategory } };

  const filterSearchText =
    (searchQuery as string).trim().length < 3
      ? null
      : { $text: { $search: searchQuery as string } };

  const filterSortingQuery = getSortingStatusToProducts(
    sorting as string
  ) as object;

  const products = await Product.find({
    $and: [filterCategory, filterSubCategory],
    ...filterSearchText,
  })
    .limit(limit)
    .skip(skip)
    .sort({ ...filterSortingQuery })
    .select("image name price _id");

  const productsCount = await Product.find({
    $and: [filterCategory, filterSubCategory],
    ...filterSearchText,
  }).countDocuments();

  await setCache(
    req,
    "product-list",
    pageableToResponse(productsCount, Number(page), products),
    createDynamicVariables(
      [],
      ["page", "categories", "subCategory", "sorting", "searchQuery"]
    )
  );

  ResponseHandler.success(
    res,
    200,
    pageableToResponse(productsCount, Number(page), products)
  );
};

export const getProductDetail = async (req: Request, res: Response) => {
  const productId = req.params.id;

  const product = await Product.findById(productId).populate(
    "comments.user",
    "name email image"
  );

  if (!product) throw new ErrorHandler(404, "Product not found");

  product.comments.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  const relatedProducts = await Product.find({
    $or: [
      { category: product?.category },
      { subCategory: product?.subCategory },
    ],
    _id: { $ne: product._id },
  })
    .limit(5)
    .select("image name price _id");

  const totalRating =
    product.comments.length === 0
      ? 0
      : product.comments.reduce((acc, comment) => +comment.rating + acc, 0) /
        product.comments.length;

  await setCache(
    req,
    "product-detail",
    {
      ...product.toObject(),
      reviewsCount: product.comments.length,
      totalRating,
      relatedProducts,
    },
    createDynamicVariables(["id"]),
    300
  );

  ResponseHandler.success(res, 200, {
    ...product.toObject(),
    reviewsCount: product.comments.length,
    totalRating,
    relatedProducts,
  });
};

export const createComment = async (req: ExtendedRequest, res: Response) => {
  const currentUser = req?.user as JwtPayload;
  const { rating, content, productId } = req.body;
  if (content.trim().lenght > 250)
    throw new ErrorHandler(
      400,
      "Comments length aren't more than 250 characters"
    );

  if (!productId) throw new ErrorHandler(400, "Product id not found");

  await Product.findByIdAndUpdate(productId, {
    $push: {
      comments: {
        rating,
        content,
        user: currentUser.userId,
      },
    },
  });

  await cacheEvict(
    req,
    "product-detail",
    createDynamicVariables([], [], [["productId", "id"]])
  );

  ResponseHandler.success(res, 200, { message: "Create comment successfully" });
};

export const deleteComment = async (req: ExtendedRequest, res: Response) => {
  const currentUser = req?.user as JwtPayload;
  const commentId = req.params.commentId;
  const productId = req.params.productId;

  const product = await Product.findOne({
    _id: productId,
    "comments._id": commentId,
    "comments.user": currentUser.userId,
  });

  if (!product) {
    throw new ErrorHandler(404, "Comment not found");
  }

  await Product.findByIdAndUpdate(productId, {
    $pull: { comments: { _id: commentId, user: currentUser.userId } },
  });

  await cacheEvict(
    req,
    "product-detail",
    createDynamicVariables([["productId", "id"]])
  );

  ResponseHandler.success(res, 200, {
    message: "Deleted comment successfully",
  });
};

export const updateComment = async (req: ExtendedRequest, res: Response) => {
  const currentUser = req?.user as JwtPayload;
  const { rating, content, productId } = req.body;
  const commentId = req.params.id;
  if (content.trim().lenght > 250)
    throw new ErrorHandler(
      400,
      "Comments length aren't more than 250 characters"
    );

  const product = await Product.findOne({
    _id: productId,
    "comments._id": commentId,
    "comments.user": currentUser.userId,
  });

  if (!product) {
    throw new ErrorHandler(404, "Comment not found");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        "comments.$[comment].content": content,
        "comments.$[comment].rating": rating,
      },
    },
    {
      new: true,
      arrayFilters: [
        { "comment._id": commentId, "comment.user": currentUser.userId },
      ],
    }
  ).populate("comments.user", "name email image");

  if (updatedProduct === null)
    throw new ErrorHandler(500, "Product update error");

  const totalRating =
    updatedProduct?.comments.length === 0
      ? 0
      : updatedProduct?.comments.reduce(
          (acc, comment) => +comment?.rating + acc,
          0
        ) / updatedProduct?.comments.length;

  await updateCache(
    req,
    "product-detail",
    {
      ...updatedProduct?.toObject(),
      totalRating,
    },
    createDynamicVariables([], [], [["productId", "id"]])
  );

  ResponseHandler.success(res, 200, { message: "Update comment successfully" });
};

export const getLatestCollections = async (req: Request, res: Response) => {
  const products = await Product.find().sort({ _id: 1 }).limit(10);

  ResponseHandler.success(res, 200, products);
};

export const getBestSellerProducts = async (req: Request, res: Response) => {
  const bestSellingProducts = await Order.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.product",
        name: { $first: "$products.name" },
        totalQuantitySold: { $sum: "$products.quantity" },
        image: { $first: "$products.image" },
        price: { $first: "$products.price" },
      },
    },
    { $sort: { totalQuantitySold: -1 } },
    { $limit: 5 },
  ]);

  ResponseHandler.success(res, 200, bestSellingProducts);
};
