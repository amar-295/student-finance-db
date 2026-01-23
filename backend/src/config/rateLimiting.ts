import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { getRedisClient } from './redis';
import config from './env';

/**
 * Create a rate limiter with Redis store or fallback to memory store
 */
const createLimiter = (options: {
    windowMs: number;
    max: number;
    message: string;
    keyGenerator?: (req: any) => string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
}): RateLimitRequestHandler => {
    const redisClient = getRedisClient();

    const baseConfig = {
        windowMs: options.windowMs,
        max: options.max,
        message: options.message,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: options.keyGenerator,
        skipSuccessfulRequests: options.skipSuccessfulRequests || false,
        skipFailedRequests: options.skipFailedRequests || false,
    };

    // Use Redis store if available, otherwise fallback to memory store
    if (redisClient) {
        return rateLimit({
            ...baseConfig,
            store: new RedisStore({
                sendCommand: ((cmd: string, ...args: string[]) => redisClient.call(cmd, ...args)) as any,
                prefix: 'rl:',
            }),
        });
    }

    console.warn('⚠️  Redis not available, using memory-based rate limiting');
    return rateLimit(baseConfig);
};

/**
 * Strict rate limiter for authentication endpoints
 * 5 attempts per 15 minutes per IP + email combination
 */
export const authLimiter = createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
    keyGenerator: (req) => {
        // Rate limit by IP + email combination for better security
        const email = req.body?.email || 'unknown';
        const ip = req.ip || req.connection?.remoteAddress || 'unknown';
        return `auth:${ip}:${email}`;
    },
    skipSuccessfulRequests: false, // Count all attempts
});

/**
 * Strict rate limiter for password reset endpoints
 * 3 attempts per hour per IP
 */
export const passwordResetLimiter = createLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: 'Too many password reset attempts. Please try again in an hour.',
    keyGenerator: (req) => {
        const ip = req.ip || req.connection?.remoteAddress || 'unknown';
        return `reset:${ip}`;
    },
});

/**
 * General API rate limiter
 * 100 requests per 15 minutes per user/IP
 */
export const apiLimiter = createLimiter({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: 'Too many requests. Please try again later.',
    keyGenerator: (req) => {
        // Prefer user ID if authenticated, fallback to IP
        return req.user?.userId || req.ip || 'unknown';
    },
});

/**
 * Strict rate limiter for registration
 * 3 registrations per hour per IP
 */
export const registrationLimiter = createLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: 'Too many registration attempts. Please try again in an hour.',
    keyGenerator: (req) => {
        const ip = req.ip || req.connection?.remoteAddress || 'unknown';
        return `register:${ip}`;
    },
});

/**
 * Moderate rate limiter for transaction creation
 * 50 transactions per 15 minutes per user
 */
export const transactionLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: 'Too many transactions. Please try again in 15 minutes.',
    keyGenerator: (req) => {
        return `txn:${req.user?.userId || req.ip}`;
    },
});
