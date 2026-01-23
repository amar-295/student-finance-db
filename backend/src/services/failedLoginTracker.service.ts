import { getRedisClient } from '../config/redis';
import logger from '../config/logger';

/**
 * Track failed login attempts for security monitoring
 */
export class FailedLoginTracker {
    private redis = getRedisClient();
    private readonly FAILED_ATTEMPTS_PREFIX = 'failed_login:';
    private readonly SUSPICIOUS_THRESHOLD = 10; // Alert after 10 failed attempts
    private readonly WINDOW_MS = 30 * 60 * 1000; // 30 minutes

    /**
     * Record a failed login attempt
     */
    async recordFailedAttempt(identifier: string, email?: string): Promise<void> {
        const key = `${this.FAILED_ATTEMPTS_PREFIX}${identifier}`;

        if (!this.redis) {
            // Fallback: just log if Redis is not available
            logger.warn({
                event: 'failed_login',
                identifier,
                email,
            }, 'Failed login attempt (Redis unavailable)');
            return;
        }

        try {
            // Increment counter
            const count = await this.redis.incr(key);

            // Set expiration on first attempt
            if (count === 1) {
                await this.redis.pexpire(key, this.WINDOW_MS);
            }

            // Log the attempt
            logger.warn({
                event: 'failed_login',
                identifier,
                email,
                attemptCount: count,
            }, `Failed login attempt ${count}`);

            // Alert if suspicious activity detected
            if (count >= this.SUSPICIOUS_THRESHOLD) {
                logger.error({
                    event: 'suspicious_login_activity',
                    identifier,
                    email,
                    attemptCount: count,
                }, `SECURITY ALERT: ${count} failed login attempts from ${identifier}`);

                // Here you could:
                // - Send email/Slack notification
                // - Trigger CAPTCHA requirement
                // - Temporarily block the IP
            }
        } catch (error) {
            logger.error({ error }, 'Error recording failed login attempt');
        }
    }

    /**
     * Clear failed attempts (on successful login)
     */
    async clearFailedAttempts(identifier: string): Promise<void> {
        if (!this.redis) return;

        try {
            const key = `${this.FAILED_ATTEMPTS_PREFIX}${identifier}`;
            await this.redis.del(key);
        } catch (error) {
            logger.error({ error }, 'Error clearing failed attempts');
        }
    }

    /**
     * Get count of failed attempts
     */
    async getFailedAttemptCount(identifier: string): Promise<number> {
        if (!this.redis) return 0;

        try {
            const key = `${this.FAILED_ATTEMPTS_PREFIX}${identifier}`;
            const count = await this.redis.get(key);
            return count ? parseInt(count, 10) : 0;
        } catch (error) {
            logger.error({ error }, 'Error getting failed attempt count');
            return 0;
        }
    }

    /**
     * Check if identifier should be challenged with CAPTCHA
     */
    async shouldChallengeCaptcha(identifier: string): Promise<boolean> {
        const count = await this.getFailedAttemptCount(identifier);
        return count >= 3; // Require CAPTCHA after 3 failed attempts
    }
}

export const failedLoginTracker = new FailedLoginTracker();
