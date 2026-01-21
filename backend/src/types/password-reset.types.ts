import { z } from 'zod';

/**
 * Password reset validation schemas
 */

/**
 * Request password reset schema
 */
export const requestPasswordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

/**
 * Reset password schema
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

/**
 * Verify reset token schema
 */
export const verifyResetTokenSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
});

export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyResetTokenInput = z.infer<typeof verifyResetTokenSchema>;
