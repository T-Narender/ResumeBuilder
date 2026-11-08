import { isRedisReady, redisClient } from "../config/redis.js";

const METRIC_KEYS = {
  redisCacheHits: "metrics:redis:cache:hits",
  redisCacheMisses: "metrics:redis:cache:misses",
  redisErrors: "metrics:redis:errors",
  mongodbCacheHits: "metrics:mongodb:cache:hits",
  mongodbCacheMisses: "metrics:mongodb:cache:misses",
  providerCalls: "metrics:ai:provider:calls",
  geminiCalls: "metrics:ai:gemini:calls",
  groqCalls: "metrics:ai:groq:calls",
  rateLimitAllowed: "metrics:ratelimit:allowed",
  rateLimitBlocked: "metrics:ratelimit:blocked"
};

const metricEntries = Object.entries(METRIC_KEYS);

export const incrementMetric = async (metricName) => {
  const key = METRIC_KEYS[metricName] || metricName;
  if (!key || !isRedisReady()) {
    if (!isRedisReady()) {
      console.log("[METRICS] Redis unavailable, skipping metric");
    }
    return;
  }

  try {
    await redisClient.incr(key);
  } catch (error) {
    console.error("[METRICS] Redis metric error:", error.message);
  }
};

export const getMetrics = async () => {
  const values = {};

  if (!isRedisReady()) {
    return metricEntries.reduce((result, [name]) => {
      result[name] = 0;
      return result;
    }, values);
  }

  try {
    const counters = await Promise.all(
      metricEntries.map(([, key]) => redisClient.get(key))
    );

    metricEntries.forEach(([name], index) => {
      const parsedValue = Number(counters[index] || 0);
      values[name] = Number.isFinite(parsedValue) ? parsedValue : 0;
    });
  } catch (error) {
    console.error("[METRICS] Redis read error:", error.message);
    metricEntries.forEach(([name]) => {
      values[name] = 0;
    });
  }

  return values;
};

export const resetMetrics = async () => {
  if (!isRedisReady()) {
    console.log("[METRICS] Redis unavailable, skipping reset");
    return;
  }

  try {
    await redisClient.del(metricEntries.map(([, key]) => key));
  } catch (error) {
    console.error("[METRICS] Redis reset error:", error.message);
  }
};

export { METRIC_KEYS };
