import { Request, Response } from "express";
import { ExtendedRequest } from "../types/types";
import { Product } from "../models/Product.schema";
import User from "../models/User.schema";
import { Order } from "../models/Order.schema";
import ResponseHandler from "../util/response";

//? Sipariş sayısı günlük (card)
//? Toplam gelir (yıllık) (card)
//? Ortalama sipariş değeri (card)
//? Sisteme kayıtlı olan kullanıcılar  (card)
//? Sisteme kayıtlı olan ürünler  (card)

//? Topwear bottomwear winterwear ürün sayıları grafikleri (barplot)
//? Günlük aylık yıllık satış grafikleri (histogram)
//? Siparişlerin kategorik dağılımı (topwear ve men) pasta grafiği
//? harita bazlı sipariş dağılımı dünya haritası siparişlerin nereden geldiği
//? en çok satan ürünler bar plot

export const getStatsCardStatictics = async (req: Request, res: Response) => {
  const currentDate = new Date();

  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const endOfYear = new Date(currentDate.getFullYear(), 11, 31);

  const yearIncome = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfYear,
          $lte: endOfYear,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const averageMonthlyOrderSalesValue = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      },
    },
    {
      $group: {
        _id: null,
        averageMonthlyOrderSalesValue: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);

  const todayOrders = await Order.countDocuments({
    createdAt: {
      $gte: new Date().setHours(0, 0, 0, 0),
      $lte: new Date().setHours(23, 59, 59, 999),
    },
  });
  const productCounts = await Product.countDocuments();
  const userCounts = await User.countDocuments();

  const productCommentsAvgRating = await Product.aggregate([
    { $unwind: "$comments" },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$comments.rating" },
      },
    },
  ]);

  const productCountsByCategory = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        counts: {
          $sum: 1,
        },
      },
    },
  ]);
  const productCountsBySubCategory = await Product.aggregate([
    {
      $group: {
        _id: "$subCategory",
        counts: {
          $sum: 1,
        },
      },
    },
  ]);

  const dailySales = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalSales: { $sum: "$totalPrice" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const monthlySales = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfYear,
          $lte: endOfYear,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        totalSales: { $sum: "$totalPrice" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const yearlySales = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y", date: "$createdAt" } },
        totalSales: { $sum: "$totalPrice" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const geographicDistribution = await Order.aggregate([
    {
      $group: {
        _id: "$locationInfo.country",
        orderCount: { $sum: 1 },
        totalIncome: { $sum: "$totalPrice" },
      },
    },
  ]);

  const categoryOrderDistribution = await Order.aggregate([
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $group: {
        _id: {
          subCategory: "$productDetails.subCategory",
        },
        orderCount: { $sum: 1 },
      },
    },
  ]);
  const bestSellingProducts = await Order.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.product",
        name: { $first: "$products.name" },
        totalQuantitySold: { $sum: "$products.quantity" },
        totalIncome: {
          $sum: { $multiply: ["$products.quantity", "$products.price"] },
        },
        image: { $first: "$products.image" },
      },
    },
    { $sort: { totalQuantitySold: -1 } },
    { $limit: 5 },
  ]);

  ResponseHandler.success(res, 200, {
    stats_card: [
      {
        dt: yearIncome[0].totalIncome,
        key: "YEAR_INCOME",
      },
      {
        dt: todayOrders,
        key: "TODAY_ORDERS",
      },
      {
        dt: productCounts,
        key: "PRODUCT_COUNT",
      },
      {
        dt: userCounts,
        key: "USER_COUNT",
      },
      {
        dt: productCommentsAvgRating[0].avgRating,
        key: "PRODUCT_COMMENT_AVG_RATING",
      },
      {
        dt: averageMonthlyOrderSalesValue[0].averageMonthlyOrderSalesValue,
        key: "AVG_MONTHLY_ORDER_SALES",
      },
    ],
    bestSellingProducts,
    categoryOrderDistribution,
    geographicDistribution,
    sales: {
      yearlySales,
      monthlySales,
      dailySales,
    },
    productCountsByQueries: {
      productCountsBySubCategory,
      productCountsByCategory,
    },
  });
};
