import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config()

const redisClient = createClient({ url: process.env.REDIS_URL });

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (error) {
    console.log("Redis connected failed");
    process.exit(1);
  }
};

connectRedis();

export default redisClient;
