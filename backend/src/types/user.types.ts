import { z } from 'zod';

/**
 * User profile validation schemas
 */

export const updateProfileSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100).optional(),
    university: z.string().max(150).optional(),
    graduationYear: z.number().int().min(2000).max(2100).optional(),
    major: z.string().max(100).optional(),
    phone: z.string().max(20).optional(),
    location: z.string().max(150).optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
    dateFormat: z.string().max(20).optional(),
    baseCurrency: z.string().length(3).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
