import { Request, Response, NextFunction } from 'express';
import { logAction } from '../services/audit.service';

/**
 * Audit Middleware - Automatically logs specific actions based on route/method
 * Can be applied globally or to specific routes
 */
export const auditMiddleware = (action: string, entityType?: string) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        // We log after next() or using res.on('finish') to ensure the action was processed?
        // Actually, simple logging of the attempt is often better for audit trails.

        // We capture basic info
        const userId = req.user?.userId;
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];

        // Metadata can include request params/body safely (filter sensitive data)
        const metadata = {
            method: req.method,
            url: req.originalUrl,
            params: req.params,
            // Avoid logging full body to save space and security, but can log IDs
            body: req.body ? { ...req.body, password: '[REDACTED]', passwordConfirm: '[REDACTED]' } : undefined
        };

        // Log the action asynchronously so it doesn't block
        logAction({
            userId,
            action: action || `${req.method} ${req.originalUrl}`,
            entityType,
            entityId: (req.params.id as string) || undefined,
            metadata,
            ipAddress: (ipAddress as string) || undefined,
            userAgent: Array.isArray(userAgent) ? userAgent[0] : (userAgent as string) || undefined
        });

        next();
    };
};
