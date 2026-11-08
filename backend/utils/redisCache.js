import { isRedisReady, redisClient } from "../config/redis.js";
import { incrementMetric } from "./metrics.js";

export const AI_RESPONSE_CACHE_TTL_SECONDS = 24 * 60 * 60;

const logUnavailable = () => {
  console.log("[REDIS CACHE] Redis unavailable, skipping cache");
};

export const getRedisCache = async (key) => {
  if (!isRedisReady()) {
    logUnavailable();
    return null;
  }

  try {
    const value = await redisClient.get(key);
    if (value === null) {
      console.log("[REDIS CACHE] MISS");
      await incrementMetric("redisCacheMisses");
      return null;
    }

    console.log("[REDIS CACHE] HIT");
    await incrementMetric("redisCacheHits");
    return value;
  } catch (error) {
    console.error("[REDIS CACHE] GET failed:", error.message);
    await incrementMetric("redisErrors");
    return null;
  }
};

export const setRedisCache = async (
  key,
  value,
  ttlSeconds = AI_RESPONSE_CACHE_TTL_SECONDS
) => {
  if (!isRedisReady()) {
    logUnavailable();
    return;
  }

  try {
    const serializedValue = typeof value === "string"
      ? value
      : JSON.stringify(value);

    await redisClient.set(key, serializedValue, { EX: ttlSeconds });
    console.log("[REDIS CACHE] SET");
  } catch (error) {
    console.error("[REDIS CACHE] SET failed:", error.message);
    await incrementMetric("redisErrors");
  }
};

export const deleteRedisCache = async (key) => {
  if (!isRedisReady()) {
    logUnavailable();
    return;
  }

  try {
    await redisClient.del(key);
    console.log("[REDIS CACHE] DELETE");
  } catch (error) {
    console.error("[REDIS CACHE] DELETE failed:", error.message);
    await incrementMetric("redisErrors");
  }
};
