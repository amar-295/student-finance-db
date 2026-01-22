import { getRedisClient } from "../config/redis";
import jwt from "jsonwebtoken";

const BLACKLIST_PREFIX = "token:blacklist:";

/**
 * Extract expiration time from JWT token
 */
const getTokenExpiration = (token: string): number => {
  try {
    const decoded = jwt.decode(token) as { exp?: number };
    if (decoded?.exp) {
      // Return remaining TTL in seconds
      const now = Math.floor(Date.now() / 1000);
      return Math.max(decoded.exp - now, 0);
    }
  } catch {
    // If we can't decode, use a default TTL of 7 days
  }
  return 7 * 24 * 60 * 60; // 7 days in seconds
};

/**
 * Add a token to the blacklist
 * Token will be automatically removed after its expiration time
 */
export const blacklistToken = async (token: string): Promise<boolean> => {
  const redis = getRedisClient();
  if (!redis) {
    console.warn("⚠️ Redis not available, token blacklisting disabled");
    return false;
  }

  try {
    const ttl = getTokenExpiration(token);
    if (ttl <= 0) {
      // Token already expired, no need to blacklist
      return true;
    }

    // Store token hash in Redis with TTL
    const key = `${BLACKLIST_PREFIX}${token}`;
    await redis.setex(key, ttl, "1");
    return true;
  } catch (error) {
    console.error("Failed to blacklist token:", error);
    return false;
  }
};

/**
 * Check if a token is blacklisted
 */
export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const redis = getRedisClient();
  if (!redis) {
    // Redis not available, assume token is valid
    return false;
  }

  try {
    const key = `${BLACKLIST_PREFIX}${token}`;
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    console.error("Failed to check token blacklist:", error);
    // On error, allow the request (fail open for availability)
    return false;
  }
};

/**
 * Blacklist both access and refresh tokens
 */
export const blacklistTokenPair = async (
  accessToken: string,
  refreshToken?: string,
): Promise<void> => {
  await blacklistToken(accessToken);
  if (refreshToken) {
    await blacklistToken(refreshToken);
  }
};
