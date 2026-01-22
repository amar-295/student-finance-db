import { z } from 'zod';

/**
 * Budget validation schemas
 */

/**
 * Create budget schema
 */
export const createBudgetSchema = z.object({
    name: z.string().min(1, 'Budget name is required'),
    categoryId: z.string().uuid('Invalid category ID'),
    amount: z.number().positive('Budget amount must be positive'),
    period: z.enum(['monthly', 'semester', 'yearly']).default('monthly'),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    alertThreshold: z.number().min(0).max(100).default(80), // Alert at 80% by default
    rollover: z.boolean().default(false), // Rollover unused budget to next period
});

/**
 * Update budget schema
 */
export const updateBudgetSchema = z.object({
    name: z.string().min(1).optional(),
    categoryId: z.string().uuid().optional(),
    amount: z.number().positive().optional(),
    period: z.enum(['monthly', 'semester', 'yearly']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    alertThreshold: z.number().min(0).max(100).optional(),
    rollover: z.boolean().optional(),
});

/**
 * Budget query schema
 */
export const budgetQuerySchema = z.object({
    name: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    period: z.enum(['monthly', 'semester', 'yearly']).optional(),
    active: z.string().optional().transform(val => val === 'true'),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type BudgetQuery = z.infer<typeof budgetQuerySchema>;

/**
 * Budget status interface
 */
export interface BudgetStatus {
    budgetId: string;
    category: {
        id: string;
        name: string;
        color: string;
    };
    period: string;
    limit: number;
    spent: number;
    remaining: number;
    percentage: number;
    status: 'safe' | 'warning' | 'danger' | 'exceeded';
    daysLeft: number;
    projectedSpending?: number;
    onTrack: boolean;
}

/**
 * Budget recommendation interface
 */
export interface BudgetRecommendation {
    category: string;
    categoryId: string;
    currentSpending: number;
    recommendedBudget: number;
    reason: string;
    confidence: number;
}