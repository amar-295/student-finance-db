import { z } from 'zod';

/**
 * Analytics validation schemas
 */

export const trendsQuerySchema = z.object({
    period: z.enum(['week', 'month', 'year']).optional().default('month'),
});

export type TrendsQuery = z.infer<typeof trendsQuerySchema>;
