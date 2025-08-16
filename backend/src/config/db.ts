import mongoose from "mongoose";
import logger from "./logger";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    logger.info('Mongo DB connected')
  } catch (error) {
    logger.error("MongoDB connection failed:", error);
    setTimeout(() => process.exit(1), 100);
  }
};

export default connectDB;
