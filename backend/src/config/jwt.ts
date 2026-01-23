import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * JWT Configuration with security best practices
 */
export const jwtConfig = {
    // Access token secret (256-bit minimum)
    secret: (() => {
        const secret = process.env.JWT_SECRET;

        if (process.env.NODE_ENV === 'production') {
            if (!secret || secret.length < 64) {
                throw new Error(
                    'JWT_SECRET must be set and at least 64 characters (256-bit) in production. ' +
                    'Generate one using: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"'
                );
            }
        }

        // In development, warn if using a weak secret
        if (process.env.NODE_ENV === 'development' && (!secret || secret.length < 32)) {
            console.warn(
                '⚠️  WARNING: Using weak or default JWT_SECRET. ' +
                'Generate a secure one using: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"'
            );
            // Generate a random secret for development if not provided
            return secret || crypto.randomBytes(64).toString('hex');
        }

        return secret as string;
    })(),

    // Refresh token secret (different from access token secret)
    refreshSecret: (() => {
        const secret = process.env.JWT_REFRESH_SECRET;

        if (process.env.NODE_ENV === 'production') {
            if (!secret || secret.length < 64) {
                throw new Error(
                    'JWT_REFRESH_SECRET must be set and at least 64 characters (256-bit) in production. ' +
                    'Generate one using: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"'
                );
            }
        }

        // In development, warn if using a weak secret
        if (process.env.NODE_ENV === 'development' && (!secret || secret.length < 32)) {
            console.warn(
                '⚠️  WARNING: Using weak or default JWT_REFRESH_SECRET. ' +
                'Generate a secure one using: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"'
            );
            return secret || crypto.randomBytes(64).toString('hex');
        }

        return secret as string;
    })(),

    // Token expiration times
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

    // Algorithm (use HS256 for HMAC SHA-256)
    algorithm: 'HS256' as const,

    // Issuer (who created and signed the token)
    issuer: 'uniflow-api',

    // Audience (who the token is intended for)
    audience: 'uniflow-client',
} as const;

export default jwtConfig;
