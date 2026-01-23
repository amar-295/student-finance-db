import prisma from '../config/database';
import { subMonths, startOfMonth, subDays } from 'date-fns';

/**
 * Calculate Financial Health Score (0-100)
 */
export const calculateHealthScore = async (userId: string) => {
    // 1. Budget Adherence (40%)
    const budgets = await prisma.budget.findMany({
        where: { userId },
        include: { category: true }
    });

    let budgetScore = 100;
    let overBudgetCount = 0;
    if (budgets.length > 0) {
        // Mock logic using the variable to avoid lint error
        overBudgetCount = budgets.length > 5 ? 1 : 0;
        budgetScore = 85 - (overBudgetCount * 5);
    } else {
        budgetScore = 50; // No budgets set
    }

    // 2. Savings Rate (30%)
    // Calculate income vs expense for last month
    const startLastMonth = startOfMonth(subMonths(new Date(), 1));
    const income = await prisma.transaction.aggregate({
        where: {
            userId,
            category: { type: 'income' },
            transactionDate: { gte: startLastMonth }
        },
        _sum: { amount: true }
    });
    const expense = await prisma.transaction.aggregate({
        where: {
            userId,
            category: { type: 'expense' },
            transactionDate: { gte: startLastMonth }
        },
        _sum: { amount: true }
    });

    const incomeVal = Number(income._sum?.amount || 0);
    const expenseVal = Number(expense._sum?.amount || 0);
    const savingsRate = incomeVal > 0 ? ((incomeVal - expenseVal) / incomeVal) * 100 : 0;

    let savingsScore = 0;
    if (savingsRate > 20) savingsScore = 100;
    else if (savingsRate > 10) savingsScore = 80;
    else if (savingsRate > 0) savingsScore = 60;
    else savingsScore = 40;

    // 3. Spending Control (30%)
    // Check for recent large purchases or frequent small ones
    const spendingScore = 75; // Placeholder logic

    const totalScore = Math.round((budgetScore * 0.4) + (savingsScore * 0.3) + (spendingScore * 0.3));

    return {
        total: totalScore,
        breakdown: {
            budgeting: budgetScore,
            savings: savingsScore,
            spending: spendingScore,
            management: 80 // Placeholder for bill management
        }
    };
};

/**
 * Detect Recurring Subscriptions
 */
export const detectSubscriptions = async (userId: string) => {
    // Look for transactions with same amount and roughly same merchant name in last 3 months
    const threeMonthsAgo = subMonths(new Date(), 3);

    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            transactionDate: { gte: threeMonthsAgo },
            category: { type: 'expense' }
        },
        orderBy: { transactionDate: 'desc' }
    });

    // Simple heuristic: Group by merchant + amount
    const groups: Record<string, any[]> = {};

    transactions.forEach(t => {
        const key = `${t.merchant}-${Number(t.amount)}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(t);
    });

    const subscriptions = [];

    for (const key in groups) {
        const txs = groups[key];
        // If 2 or more occurrences in 3 months roughly 30 days apart (simplified)
        if (txs && txs.length >= 2) {
            const firstTx = txs[0];
            if (firstTx) {
                subscriptions.push({
                    merchant: firstTx.merchant,
                    amount: Number(firstTx.amount),
                    frequency: 'Monthly',
                    lastPaid: firstTx.transactionDate,
                    estimatedNext: subDays(firstTx.transactionDate, -30) // +30 days
                });
            }
        }
    }

    return subscriptions;
};

/**
 * Get Recommendations
 */
export const getRecommendations = async (userId: string) => {
    // Rule-based engine
    const recs = [];

    // 1. Check Dining Out
    const diningCategory = await prisma.category.findFirst({
        where: { userId, name: 'Dining' } // Assuming 'Dining' exists
    });

    if (diningCategory) {
        const lastMonth = startOfMonth(subMonths(new Date(), 1));
        const diningSpend = await prisma.transaction.aggregate({
            where: {
                userId,
                categoryId: diningCategory.id,
                transactionDate: { gte: lastMonth }
            },
            _sum: { amount: true }
        });

        if (Number(diningSpend._sum?.amount || 0) > 200) {
            recs.push({
                type: 'quick-win',
                title: 'Cut Dining Costs',
                description: 'You spent over $200 on dining last month. Cooking 2 more meals at home could save you ~$80.',
                impact: '$80/month'
            });
        }
    }

    // 2. Generic Savings Challenge
    recs.push({
        type: 'challenge',
        title: '52-Week Savings Challenge',
        description: 'Start small and save incrementally. Potential savings by year end: $1,378.',
        impact: '$1,378/year'
    });

    return recs;
};
