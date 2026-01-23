import { z } from 'zod';

/**
 * Common validation schemas
 */

export const idParamSchema = z.object({
    id: z.string().uuid('Invalid ID format'),
});

export const paginationQuerySchema = z.object({
    page: z.string().optional().transform((val) => parseInt(val || '1')),
    limit: z.string().optional().transform((val) => parseInt(val || '20')),
});
