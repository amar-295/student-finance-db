import Redis from "ioredis";
import config from "./env";

let redisClient: Redis | null = null;

/**
 * Get Redis client instance
 * Returns null if Redis is not configured (graceful fallback)
 */
export const getRedisClient = (): Redis | null => {
  if (!config.redis.url) {
    return null;
  }

  if (!redisClient) {
    redisClient = new Redis(config.redis.url, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        if (times > 3) {
          console.error("❌ Redis connection failed after 3 retries");
          return null; // Stop retrying
        }
        return Math.min(times * 100, 3000);
      },
      lazyConnect: true,
    });

    redisClient.on("connect", () => {
      console.log("✅ Redis connected successfully");
    });

    redisClient.on("error", (err: Error) => {
      console.error("❌ Redis error:", err.message);
    });
  }

  return redisClient;
};

/**
 * Check if Redis is available and connected
 */
export const isRedisAvailable = async (): Promise<boolean> => {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.ping();
    return true;
  } catch {
    return false;
  }
};

/**
 * Gracefully disconnect Redis
 */
export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};

export default getRedisClient;
