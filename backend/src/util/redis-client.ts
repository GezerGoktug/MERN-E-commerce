import redisClient from "../config/redis";

const RedisClient = {
  set: (key: string, value: string, ttl: number = 180) => {
    return redisClient.setEx(key, ttl, value);
  },

  get: (key: string) => {
    return redisClient.get(key);
  },

  del: (key: string) => {
    return redisClient.del(key);
  },
};

export default RedisClient;
