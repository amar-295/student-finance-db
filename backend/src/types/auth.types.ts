import { z } from 'zod';

/**
 * User registration schema
 */
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  name: z.string({ required_error: 'Name is required' }).min(1, 'Name is required').max(100, 'Name is too long').trim(),
  university: z.string().max(150).optional(),
  baseCurrency: z.string().length(3, 'Currency must be 3-letter ISO code').default('USD'),
});

/**
 * User login schema
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

/**
 * Refresh token schema
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

/**
 * Update profile schema
 */
export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  university: z.string().max(150).optional(),
  baseCurrency: z.string().length(3, 'Currency must be 3-letter ISO code').optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
