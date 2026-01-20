import { z } from 'zod';

/**
 * Account validation schemas
 */

export const createAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(100),
  accountType: z.enum(['checking', 'savings', 'credit', 'cash', 'other']),
  balance: z.number().default(0),
  currency: z.string().length(3, 'Currency must be 3-letter ISO code').default('USD'),
  institution: z.string().max(150).optional(),
  accountNumber: z.string().max(50).optional(),
});

export const updateAccountSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  accountType: z.enum(['checking', 'savings', 'credit', 'cash', 'other']).optional(),
  // Note: balance is intentionally excluded to prevent mass assignment
  // Balance should only be modified via transaction operations
  currency: z.string().length(3).optional(),
  institution: z.string().max(150).optional(),
  accountNumber: z.string().max(50).optional(),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;