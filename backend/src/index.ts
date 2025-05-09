import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "cors";

import authRouter from "./routes/auth.route";
import productRouter from "./routes/product.route";
import statsRouter from "./routes/stats.route";
import paymentRouter from "./routes/payment.route";
import orderRouter from "./routes/order.route";
import cookieParser from "cookie-parser";
import passport from "passport";
import { errorHandler } from "./middleware/errorHandler.middleware";
import helmet from "helmet";
import swagger from "swagger-ui-express";

dotenv.config();
connectDB();

require("../src/config/redis");
require("./strategy/google_strategy");
require("./config/cloudinary");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET,POST,PUT,DELETE"],
    credentials: true,
  })
);

app.use(helmet());

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", statsRouter);
if (process.env.NODE_ENV === "development") {
  const swaggerDocument = require("./swagger.json");
  app.use(
    "/api-docs",
    swagger.serve,
    swagger.setup(swaggerDocument, { explorer: true })
  );
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
