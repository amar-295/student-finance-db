import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils';

const prisma = new PrismaClient();

type PrismaModelName = 'account' | 'budget' | 'transaction' | 'billSplit' | 'group';

/**
 * Global IDOR Protection Middleware
 * Verifies that the resource being accessed belongs to the authenticated user.
 * 
 * @param modelName - The Prisma model name to check against (e.g., 'account', 'budget')
 * @param idParam - The name of the route parameter containing the resource ID (default: 'id')
 * @param userIdField - The field name in the resource that stores the owner's User ID (default: 'userId')
 */
export const validateOwnership = (
    modelName: PrismaModelName,
    idParam: string = 'id',
    userIdField: string = 'userId'
) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            if (!req.user || !req.user.userId) {
                throw new ApiError(401, 'User authentication required for ownership validation');
            }

            const resourceId = req.params[idParam];
            if (!resourceId) {
                // If the route doesn't have the expected ID, skip validation (or throw error based on strictness)
                // Here we choose to skip, assuming if ID is missing, the route controller handles "create" or "list" logic
                return next();
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const resource = await prisma[modelName].findUnique({
                where: { id: resourceId },
                select: { [userIdField]: true },
            });

            if (!resource) {
                throw new ApiError(404, `${modelName} not found`);
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (resource[userIdField] !== req.user.userId) {
                throw new ApiError(403, 'Access denied: You do not own this resource');
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
