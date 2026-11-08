import jwt from "jsonwebtoken";
import { isRedisReady, redisClient } from "../config/redis.js";
import { incrementMetric } from "./metrics.js";

const getUserId = (req) => {
  const requestUserId = req.user?._id?.toString() || req.user?.id?.toString();
  if (requestUserId) {
    return requestUserId;
  }

  const authorization = req.headers?.authorization || "";
  if (!authorization.startsWith("Bearer ") || !process.env.JWT_SECRET) {
    return null;
  }

  try {
    const token = authorization.slice("Bearer ".length);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id?.toString() || null;
  } catch {
    return null;
  }
};

const getClientIdentity = (req) => {
  const userId = getUserId(req);
  if (userId) {
    return `user:${userId}`;
  }

  return `ip:${req.ip || req.socket?.remoteAddress || "unknown"}`;
};

const safeKeyPart = (value) => String(value).replace(/[^a-zA-Z0-9:._-]/g, "_");

export const createRateLimiter = ({
  windowSeconds,
  maxRequests,
  keyPrefix
}) => {
  if (!Number.isInteger(windowSeconds) || windowSeconds <= 0) {
    throw new Error("windowSeconds must be a positive integer");
  }

  if (!Number.isInteger(maxRequests) || maxRequests <= 0) {
    throw new Error("maxRequests must be a positive integer");
  }

  if (!keyPrefix) {
    throw new Error("keyPrefix is required");
  }

  return async (req, res, next) => {
    if (!isRedisReady()) {
      console.log("[RATE LIMIT] REDIS ERROR - FAIL OPEN");
      return next();
    }

    const identity = getClientIdentity(req);
    const key = `${keyPrefix}${safeKeyPart(identity)}`;

    try {
      const requestCount = await redisClient.incr(key);

      if (requestCount === 1) {
        await redisClient.expire(key, windowSeconds);
      }

      const remaining = Math.max(0, maxRequests - requestCount);
      const retryAfter = await redisClient.ttl(key);

      res.set("X-RateLimit-Limit", String(maxRequests));
      res.set("X-RateLimit-Remaining", String(remaining));
      if (retryAfter > 0) {
        res.set("Retry-After", String(retryAfter));
      }

      if (requestCount > maxRequests) {
        console.log("[RATE LIMIT] BLOCKED");
        await incrementMetric("rateLimitBlocked");
        return res.status(429).json({
          message: "Too many requests. Please try again later."
        });
      }

      console.log("[RATE LIMIT] ALLOWED");
      await incrementMetric("rateLimitAllowed");
      return next();
    } catch (error) {
      console.error("[RATE LIMIT] REDIS ERROR - FAIL OPEN", error.message);
      return next();
    }
  };
};
