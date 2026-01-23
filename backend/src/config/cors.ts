import cors from 'cors';
import config from './env';

/**
 * Allowed origins based on environment
 */
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [
        // Production domains (update these with your actual production URLs)
        process.env.FRONTEND_URL || 'https://app.uniflow.com',
        'https://uniflow.com',
        'https://www.uniflow.com',
    ]
    : [
        // Development/local origins
        'http://localhost:5173', // Vite default
        'http://localhost:3000', // React/Next.js default
        'http://localhost:5000', // Backend (for Swagger UI)
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        config.cors.origin, // From environment variable
    ];

/**
 * Secure CORS configuration
 */
export const corsOptions: cors.CorsOptions = {
    /**
     * Origin validation callback
     */
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, curl)
        // In production, you might want to restrict this
        if (!origin) {
            if (process.env.NODE_ENV === 'production') {
                // In production, you can choose to reject requests without origin
                // return callback(new Error('Not allowed by CORS - no origin'));
            }
            return callback(null, true);
        }

        // Check if origin is in allowlist
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`🚫 CORS blocked request from origin: ${origin}`);
            callback(new Error(`Not allowed by CORS - origin: ${origin}`));
        }
    },

    /**
     * Allow credentials (cookies, authorization headers)
     */
    credentials: true,

    /**
     * Allowed HTTP methods
     */
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

    /**
     * Allowed request headers
     */
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
    ],

    /**
     * Exposed response headers (accessible to client)
     */
    exposedHeaders: [
        'X-Total-Count',
        'X-Page-Count',
        'X-Current-Page',
    ],

    /**
     * Preflight cache duration (24 hours)
     * Reduces OPTIONS requests
     */
    maxAge: 86400, // 24 hours in seconds

    /**
     * Continue to next middleware even if CORS check fails
     * Set to false to block failed CORS requests immediately
     */
    preflightContinue: false,

    /**
     * Pass CORS preflight response to next handler
     */
    optionsSuccessStatus: 204, // Some legacy browsers choke on 204
};

export default corsOptions;
