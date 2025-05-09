import { ErrorHandler } from "../error/errorHandler";
import RedisClient from "../util/redis-client";

const CacheManager = {
  get: async (key: string) => {
    try {
      const cachedValue = await RedisClient.get(key);
      if (!cachedValue) return null;

      return JSON.parse(cachedValue);
    } catch (error) {
      console.error("Cache get error:", error);
      throw new ErrorHandler(500, "Error getting cache");
    }
  },
  set: async <T>(key: string, data: T, ttl?: number) => {
    try {
      await RedisClient.set(key, JSON.stringify(data), ttl);
    } catch (error) {
      console.error("Cache set error:", error);
      throw new ErrorHandler(500, "Error setting cache");
    }
  },
  del: async (key: string) => {
    try {
      await RedisClient.del(key);
    } catch (error) {
      console.error("Cache delete error:", error);
      throw new ErrorHandler(500, "Error deleting cache");
    }
  },
};

export default CacheManager;
