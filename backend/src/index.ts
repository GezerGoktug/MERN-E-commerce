import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "./config/cors";

import mainRouter from "./routes/index";
import cookieParser from "cookie-parser";
import passport from "passport";
import { errorHandler } from "./middleware/errorHandler.middleware";
import helmet from "helmet";
import swagger from "swagger-ui-express";
import defineClientId from "./util/client-id-generator";
import logger from "./config/logger";
import morgan from "morgan"
import { ExtendedRequest } from "./types/types";

dotenv.config();
connectDB();

require("./config/redis");
require("./strategy/google_strategy");
require("./config/cloudinary");

const app = express();

app.use(cors);

app.use(helmet());

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use(defineClientId);

morgan.token("user-info", (req: ExtendedRequest) => {
  if (req.user) {
    return `{\n- userId: ${req.user.userId || "-"}\n- Role: ${req.user.role || "-"}\n- Email: ${req.user.email || "-"}\n}`;
  }
  return "NULL";
});

const morganFormat = [
  '--- REQUEST LOG START ---',
  '-> IP: :remote-addr',
  '-> URL: :url',
  '-> Status: :status',
  '-> Method: :method',
  '-> Response-Length: :res[content-length]',
  '-> Response-Time: :response-time ms',
  '-> User: :user-info',
  '--- REQUEST LOG END ---\n'
].join('\n');

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use("/api", mainRouter);

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
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
