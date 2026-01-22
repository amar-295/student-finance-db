import { z } from 'zod';

/**
 * Account validation schemas
 */

export const createAccountSchema = z.object({
  name: z.string({ required_error: 'Account name is required' }).min(1, 'Account name is required').max(100),
  accountType: z.enum(['checking', 'savings', 'credit', 'cash', 'other'], {
    errorMap: () => ({ message: 'Account type must be one of: checking, savings, credit, cash, other' }),
  }),
  balance: z.number().default(0),
  currency: z.string().length(3, 'Currency must be 3-letter ISO code').default('USD'),
  institution: z.string().max(150, 'Institution name too long').optional(),
  accountNumber: z.string().max(50, 'Account number too long').optional(),
});

export const updateAccountSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  accountType: z.enum(['checking', 'savings', 'credit', 'cash', 'other']).optional(),
  balance: z.number().optional(),
  currency: z.string().length(3).optional(),
  institution: z.string().max(150).optional(),
  accountNumber: z.string().max(50).optional(),
});

export const accountIdSchema = z.object({
  id: z.string().uuid('Invalid account ID format'),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;

// New schemas
export const transferFundsSchema = z.object({
  fromId: z.string().uuid(),
  toId: z.string().uuid(),
  amount: z.number().positive(),
  date: z.string().transform((str) => new Date(str)),
  note: z.string().optional()
});

export const getHistoryQuerySchema = z.object({
  days: z.string().transform((val) => parseInt(val)).optional()
});