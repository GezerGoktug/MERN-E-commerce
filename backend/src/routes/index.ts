import express from "express";
import authRouter from "../routes/auth.route";
import productRouter from "../routes/product.route";
import statsRouter from "../routes/stats.route";
import paymentRouter from "../routes/payment.route";
import userRouter from "../routes/user.route";
import orderRouter from "../routes/order.route";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/product", productRouter);
router.use("/payment", paymentRouter);
router.use("/order", orderRouter);
router.use("/admin", statsRouter);
router.use("/user", userRouter);

export default router;