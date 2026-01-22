import prisma from '../config/database';
import { NotFoundError, BadRequestError } from '../utils';
import type {
    CreateBudgetInput,
    UpdateBudgetInput,
    BudgetQuery,
    BudgetStatus,
    BudgetRecommendation,
} from '../types/budget.types';

/**
 * Create a new budget
 */
export const createBudget = async (userId: string, input: CreateBudgetInput) => {
    // Verify category exists and belongs to user
    const category = await prisma.category.findFirst({
        where: {
            id: input.categoryId,
            OR: [{ userId }, { isSystem: true }],
        },
    });

    if (!category) {
        throw new NotFoundError('Category not found');
    }

    // Check if budget already exists for this category and period
    const existingBudget = await prisma.budget.findFirst({
        where: {
            userId,
            categoryId: input.categoryId,
            periodType: input.period,
            deletedAt: null,
        },
    });

    if (existingBudget) {
        throw new BadRequestError(
            `Budget already exists for ${category.name} (${input.period}). Update it instead.`
        );
    }

    // Calculate start and end dates based on period
    const { startDate, endDate } = calculateBudgetPeriod(
        input.period,
        input.startDate,
        input.endDate
    );

    // Create budget
    console.log('Creating budget with data:', {
        userId,
        name: input.name,
        categoryId: input.categoryId,
        amount: input.amount,
        periodType: input.period,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
    });

    const budget = await prisma.budget.create({
        data: {
            userId,
            name: input.name,
            categoryId: input.categoryId,
            amount: input.amount,
            periodType: input.period,
            startDate,
            endDate,
            alertThreshold: input.alertThreshold || 80,
            rollover: input.rollover || false,
        },
        include: {
            category: true,
        },
    });

    return budget;
};

/**
 * Get all budgets for user
 */
export const getUserBudgets = async (userId: string, query: BudgetQuery) => {
    const where: any = {
        userId,
        deletedAt: null,
    };

    if (query.categoryId) {
        where.categoryId = query.categoryId;
    }

    if (query.name) {
        where.name = { contains: query.name, mode: 'insensitive' };
    }

    if (query.period) {
        where.periodType = query.period;
    }

    if (query.active !== undefined) {
        const now = new Date();
        if (query.active) {
            where.startDate = { lte: now };
            where.endDate = { gte: now };
        }
    }

    const budgets = await prisma.budget.findMany({
        where,
        include: {
            category: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return budgets;
};

/**
 * Get single budget
 */
export const getBudgetById = async (userId: string, budgetId: string) => {
    const budget = await prisma.budget.findFirst({
        where: {
            id: budgetId,
            userId,
            deletedAt: null,
        },
        include: {
            category: true,
        },
    });

    if (!budget) {
        throw new NotFoundError('Budget not found');
    }

    return budget;
};

/**
 * Update budget
 */
export const updateBudget = async (
    userId: string,
    budgetId: string,
    input: UpdateBudgetInput
) => {
    const existing = await prisma.budget.findFirst({
        where: {
            id: budgetId,
            userId,
            deletedAt: null,
        },
    });

    if (!existing) {
        throw new NotFoundError('Budget not found');
    }

    // If changing category, verify it exists
    if (input.categoryId) {
        const category = await prisma.category.findFirst({
            where: {
                id: input.categoryId,
                OR: [{ userId }, { isSystem: true }],
            },
        });

        if (!category) {
            throw new NotFoundError('Category not found');
        }
    }

    // Recalculate dates if period changed
    let dateUpdate = {};
    if (input.period && input.period !== existing.periodType) {
        const { startDate, endDate } = calculateBudgetPeriod(input.period);
        dateUpdate = {
            periodType: input.period,
            startDate,
            endDate
        };
    }

    const budget = await prisma.budget.update({
        where: { id: budgetId },
        data: {
            ...input,
            ...dateUpdate,
        },
        include: {
            category: true,
        },
    });

    return budget;
};

/**
 * Delete budget
 */
export const deleteBudget = async (userId: string, budgetId: string) => {
    const budget = await prisma.budget.findFirst({
        where: {
            id: budgetId,
            userId,
            deletedAt: null,
        },
    });

    if (!budget) {
        throw new NotFoundError('Budget not found');
    }

    await prisma.budget.update({
        where: { id: budgetId },
        data: { deletedAt: new Date() },
    });

    return { message: 'Budget deleted successfully' };
};

/**
 * Get budget status for all budgets
 */
export const getAllBudgetStatuses = async (userId: string): Promise<BudgetStatus[]> => {
    const budgets = await prisma.budget.findMany({
        where: {
            userId,
            deletedAt: null,
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
        },
        include: {
            category: true,
        },
    });

    const statuses = await Promise.all(
        budgets.map(budget => calculateBudgetStatus(userId, budget))
    );

    return statuses;
};

/**
 * Calculate budget status for a single budget
 */
const calculateBudgetStatus = async (userId: string, budget: any): Promise<BudgetStatus> => {
    // Get transactions in budget period
    const aggregations = await prisma.transaction.aggregate({
        where: {
            userId,
            categoryId: budget.categoryId,
            transactionDate: {
                gte: budget.startDate,
                lte: budget.endDate,
            },
            amount: { lt: 0 }, // Only expenses
            deletedAt: null,
        },
        _sum: {
            amount: true,
        },
    });

    const spent = Math.abs(Number(aggregations._sum.amount || 0));

    const limit = Number(budget.amount);
    const remaining = limit - spent;
    const percentage = (spent / limit) * 100;

    // Calculate days left
    const now = new Date();
    const daysLeft = Math.ceil(
        (budget.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate total days in period
    const totalDays = Math.ceil(
        (budget.endDate.getTime() - budget.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysElapsed = totalDays - daysLeft;

    // Project spending to end of period
    const dailySpending = daysElapsed > 0 ? spent / daysElapsed : 0;
    const projectedSpending = dailySpending * totalDays;
    const onTrack = projectedSpending <= limit;

    // Determine status
    let status: 'safe' | 'warning' | 'danger' | 'exceeded';
    if (percentage >= 100) {
        status = 'exceeded';
    } else if (percentage >= budget.alertThreshold) {
        status = 'danger';
    } else if (percentage >= budget.alertThreshold - 20) {
        status = 'warning';
    } else {
        status = 'safe';
    }

    return {
        budgetId: budget.id,
        category: {
            id: budget.category.id,
            name: budget.category.name,
            color: budget.category.color,
        },
        period: budget.period,
        limit,
        spent,
        remaining,
        percentage: Math.round(percentage * 10) / 10,
        status,
        daysLeft,
        projectedSpending: Math.round(projectedSpending * 100) / 100,
        onTrack,
    };
};

/**
 * Get budget recommendations based on past spending
 */
export const getBudgetRecommendations = async (
    userId: string
): Promise<BudgetRecommendation[]> => {
    // Get last 3 months of transactions
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            transactionDate: { gte: threeMonthsAgo },
            amount: { lt: 0 },
            deletedAt: null,
        },
        include: {
            category: true,
        },
    });

    // Group by category
    const categorySpending: Record<string, { total: number; months: Set<string>; categoryId: string }> = {};

    transactions.forEach(t => {
        const categoryName = t.category?.name || 'Other';
        const categoryId = t.category?.id || '';
        const monthKey = `${t.transactionDate.getFullYear()}-${t.transactionDate.getMonth()}`;

        if (!categorySpending[categoryName]) {
            categorySpending[categoryName] = {
                total: 0,
                months: new Set(),
                categoryId,
            };
        }

        categorySpending[categoryName].total += Math.abs(Number(t.amount));
        categorySpending[categoryName].months.add(monthKey);
    });

    // Calculate recommendations
    const recommendations: BudgetRecommendation[] = [];

    for (const [category, data] of Object.entries(categorySpending)) {
        const monthCount = data.months.size;
        if (monthCount === 0) continue;

        const averageMonthly = data.total / monthCount;

        // Add 10% buffer for safety
        const recommendedBudget = Math.ceil(averageMonthly * 1.1);

        // Confidence based on data points
        const confidence = Math.min(monthCount / 3, 1); // Max confidence with 3+ months

        recommendations.push({
            category,
            categoryId: data.categoryId,
            currentSpending: Math.round(averageMonthly),
            recommendedBudget,
            reason: `Based on ${monthCount} month(s) of spending data. Average: ₹${Math.round(averageMonthly)}/month`,
            confidence: Math.round(confidence * 100),
        });
    }

    // Sort by spending amount
    return recommendations.sort((a, b) => b.currentSpending - a.currentSpending);
};

/**
 * Calculate budget period dates
 */
const calculateBudgetPeriod = (
    period: 'monthly' | 'semester' | 'yearly',
    customStart?: string,
    customEnd?: string
): { startDate: Date; endDate: Date } => {
    if (customStart && customEnd) {
        return {
            startDate: new Date(customStart),
            endDate: new Date(customEnd),
        };
    }

    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
        case 'monthly':
            startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 12, 0, 0));
            endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 12, 0, 0));
            break;

        case 'semester':
            // Assume semester is 6 months
            const currentMonth = now.getUTCMonth();
            const semesterStart = currentMonth < 6 ? 0 : 6;
            startDate = new Date(Date.UTC(now.getUTCFullYear(), semesterStart, 1, 12, 0, 0));
            endDate = new Date(Date.UTC(now.getUTCFullYear(), semesterStart + 6, 0, 12, 0, 0));
            break;

        case 'yearly':
            startDate = new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 12, 0, 0));
            endDate = new Date(Date.UTC(now.getUTCFullYear(), 11, 31, 12, 0, 0));
            break;
    }

    return { startDate, endDate };
};

export const getBudgetTransactions = async (
    userId: string,
    budgetId: string,
    query: { startDate?: string; endDate?: string; limit?: number }
) => {
    // 1. Get the budget to know the category and dates
    const budget = await prisma.budget.findUnique({
        where: { id: budgetId, userId },
        include: { category: true }
    });

    if (!budget) {
        throw new NotFoundError('Budget not found');
    }

    // 2. Query transactions
    const where: any = {
        userId,
        categoryId: budget.categoryId,
        transactionDate: {
            gte: query.startDate ? new Date(query.startDate) : budget.startDate,
            lte: query.endDate ? new Date(query.endDate) : budget.endDate
        }
    };

    const transactions = await prisma.transaction.findMany({
        where,
        orderBy: { transactionDate: 'desc' },
        take: query.limit || 50,
        include: {
            category: true,
            account: {
                select: {
                    id: true,
                    name: true,
                    accountType: true
                }
            }
        }
    });

    return transactions;
};

export const getBudgetAnalytics = async (userId: string, budgetId: string) => {
    const budget = await prisma.budget.findUnique({
        where: { id: budgetId, userId },
        include: { category: true }
    });

    if (!budget) {
        throw new NotFoundError('Budget not found');
    }

    const startDate = budget.startDate;
    const endDate = budget.endDate;
    const now = new Date();

    // 1. Total Spent in Period
    const aggregations = await prisma.transaction.aggregate({
        where: {
            userId,
            categoryId: budget.categoryId,
            transactionDate: {
                gte: startDate,
                lte: endDate
            }
        },
        _sum: { amount: true },
        _avg: { amount: true },
        _count: { id: true }
    });

    const totalSpent = Number(aggregations._sum.amount || 0);
    const avgTransaction = Number(aggregations._avg.amount || 0);
    const transactionCount = aggregations._count.id;

    const remaining = Number(budget.amount) - totalSpent;
    const percentUsed = (totalSpent / Number(budget.amount)) * 100;

    // Days calculation
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, totalDays - daysPassed);

    const avgDailySpend = daysPassed > 0 ? totalSpent / daysPassed : 0;
    const projectedSpend = totalSpent + (avgDailySpend * daysRemaining);

    // 2. Daily Spending Trend (for Line Chart)
    const dailySpending = await prisma.transaction.groupBy({
        by: ['transactionDate'],
        where: {
            userId,
            categoryId: budget.categoryId,
            transactionDate: {
                gte: startDate,
                lte: endDate
            }
        },
        _sum: { amount: true },
        orderBy: { transactionDate: 'asc' }
    });

    const trendData = dailySpending.map(item => ({
        date: item.transactionDate.toISOString().split('T')[0],
        amount: Number(item._sum.amount || 0)
    }));

    // 3. Top Merchants (for Breakdown)
    const merchantSpending = await prisma.transaction.groupBy({
        by: ['merchant'],
        where: {
            userId,
            categoryId: budget.categoryId,
            transactionDate: {
                gte: startDate,
                lte: endDate
            }
        },
        _sum: { amount: true },
        orderBy: {
            _sum: { amount: 'desc' }
        },
        take: 5
    });

    const merchantBreakdown = merchantSpending.map(item => ({
        name: item.merchant || 'Unknown',
        value: Number(item._sum.amount || 0),
        percentage: (Number(item._sum.amount || 0) / totalSpent) * 100
    }));

    return {
        budget: {
            ...budget,
            totalSpent,
            remaining,
            percentUsed,
            daysRemaining
        },
        stats: {
            avgDailySpend,
            projectedSpend,
            avgTransaction,
            transactionCount
        },
        trend: trendData,
        breakdown: merchantBreakdown
    };
};



/**
 * Check budgets and create alerts
 */
export const checkBudgetAlerts = async (userId: string) => {
    const statuses = await getAllBudgetStatuses(userId);
    const alerts: any[] = [];

    for (const status of statuses) {
        if (status.status === 'exceeded') {
            alerts.push({
                type: 'budget_exceeded',
                budgetId: status.budgetId,
                category: status.category.name,
                message: `You've exceeded your ${status.category.name} budget by ₹${Math.abs(status.remaining).toFixed(0)}`,
                severity: 'high',
            });
        } else if (status.status === 'danger') {
            alerts.push({
                type: 'budget_warning',
                budgetId: status.budgetId,
                category: status.category.name,
                message: `You're at ${status.percentage}% of your ${status.category.name} budget with ${status.daysLeft} days left`,
                severity: 'medium',
            });
        }

        // Check if not on track
        if (!status.onTrack && status.status !== 'exceeded') {
            alerts.push({
                type: 'budget_projection',
                budgetId: status.budgetId,
                category: status.category.name,
                message: `At current rate, you'll exceed your ${status.category.name} budget by ₹${(status.projectedSpending! - status.limit).toFixed(0)}`,
                severity: 'low',
            });
        }
    }

    return alerts;
};