import dotenv from "dotenv";
import { createClient } from "redis";
import logger from "./logger";

dotenv.config()

const redisClient = createClient({ url: process.env.REDIS_URL });

const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info("Redis connected");
  } catch (error) {
    logger.error("Redis connected failed", error);
    setTimeout(() => process.exit(1), 100);

  }
};

connectRedis();

export default redisClient;
