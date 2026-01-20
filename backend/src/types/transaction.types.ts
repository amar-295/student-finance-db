import { z } from 'zod';

/**
 * Transaction validation schemas
 */

/**
 * Create transaction schema
 */
export const createTransactionSchema = z.object({
  accountId: z.string().uuid('Invalid account ID'),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  amount: z.number().refine(val => val !== 0, 'Amount cannot be zero'),
  merchant: z.string().min(1, 'Merchant name is required').max(150),
  description: z.string().max(500).optional(),
  transactionDate: z.string().datetime().optional(),
  currency: z.string().length(3, 'Currency must be 3-letter ISO code').default('USD'),
  tags: z.array(z.string()).optional(),
  notes: z.string().max(1000).optional(),
});

/**
 * Update transaction schema
 */
export const updateTransactionSchema = z.object({
  accountId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  amount: z.number().refine(val => val !== 0, 'Amount cannot be zero').optional(),
  merchant: z.string().min(1).max(150).optional(),
  description: z.string().max(500).optional(),
  transactionDate: z.string().datetime().optional(),
  currency: z.string().length(3).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().max(1000).optional(),
});

/**
 * Get transactions query schema (for filtering)
 */
export const getTransactionsQuerySchema = z.object({
  // Pagination
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => parseInt(val || '20')),
  
  // Filters
  accountId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minAmount: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  maxAmount: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  merchant: z.string().optional(),
  search: z.string().optional(),
  
  // Sorting
  sortBy: z.enum(['date', 'amount', 'merchant', 'category']).optional().default('date'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Transaction summary query schema
 */
export const transactionSummarySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  groupBy: z.enum(['category', 'merchant', 'day', 'week', 'month']).optional().default('category'),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type GetTransactionsQuery = z.infer<typeof getTransactionsQuerySchema>;
export type TransactionSummaryQuery = z.infer<typeof transactionSummarySchema>;