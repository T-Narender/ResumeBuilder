import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (error) => {
  console.error("[REDIS ERROR]", error.message);
});

redisClient.on("ready", () => {
  console.log("[REDIS READY] Redis connection is ready");
});

redisClient.on("reconnecting", () => {
  console.log("[REDIS RECONNECTING] Redis connection is reconnecting");
});

export const connectRedis = async () => {
  if (redisClient.isReady) {
    return true;
  }

  try {
    await redisClient.connect();
    return true;
  } catch (error) {
    console.error("[REDIS CONNECTION FAILED]", error.message);
    return false;
  }
};

export const isRedisReady = () => redisClient.isReady;
