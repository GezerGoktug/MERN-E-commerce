import dotenv from "dotenv";
import { createClient } from "redis";
import logger from "./logger";

dotenv.config()

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    connectTimeout: 20000,
    reconnectStrategy: (retries) => {
      if (retries > 20) {
        logger.error("❌ Redis connection retries exhausted. Stopping retries.");
        return new Error("Redis connection retries exhausted.");
      }

      const delay = Math.min(retries * 500, 3000); // maks delay 3000ms

      logger.warn(`Redis connection lost. Reconnecting attempt #${retries} in ${delay}ms...`);
      return delay;
    },
  }
});

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
