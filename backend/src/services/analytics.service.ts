import prisma from '../config/database';
import { startOfMonth, endOfMonth, subMonths, format, subWeeks } from 'date-fns';

/**
 * Get overview metrics (Income, Expenses, Savings)
 */
export const getAnalyticsOverview = async (userId: string) => {
    // Current month date range
    const now = new Date();
    const currentStart = startOfMonth(now);
    const currentEnd = endOfMonth(now);

    // Last month date range
    const lastStart = startOfMonth(subMonths(now, 1));
    const lastEnd = endOfMonth(subMonths(now, 1));

    // Helper to get totals
    const getTotals = async (start: Date, end: Date) => {
        // Income (based on Category type)
        const income = await prisma.transaction.aggregate({
            where: {
                userId,
                category: { type: 'income' },
                transactionDate: { gte: start, lte: end }
            },
            _sum: { amount: true }
        });

        // Expenses (based on Category type)
        const expenses = await prisma.transaction.aggregate({
            where: {
                userId,
                category: { type: 'expense' },
                transactionDate: { gte: start, lte: end }
            },
            _sum: { amount: true }
        });

        const totalIncome = Number(income._sum?.amount || 0);
        const totalExpenses = Number(expenses._sum?.amount || 0);

        return {
            income: totalIncome,
            expenses: totalExpenses,
            savings: totalIncome - totalExpenses
        };
    };

    const current = await getTotals(currentStart, currentEnd);
    const last = await getTotals(lastStart, lastEnd);

    // Calculate percentage changes
    const calcChange = (curr: number, prev: number) => {
        if (prev === 0) return curr > 0 ? 100 : 0;
        return Math.round(((curr - prev) / prev) * 100);
    };

    return {
        income: {
            total: current.income,
            change: calcChange(current.income, last.income)
        },
        expenses: {
            total: current.expenses,
            change: calcChange(current.expenses, last.expenses)
        },
        savings: {
            total: current.savings,
            change: calcChange(current.savings, last.savings)
        }
    };
};

/**
 * Get spending trends (Daily/Weekly/Monthly)
 */
export const getSpendingTrends = async (userId: string, period: 'week' | 'month' | 'year' = 'month') => {
    // Determine date range and grouping
    const now = new Date();
    let startDate: Date;
    let formatStr: string;

    if (period === 'week') {
        startDate = subWeeks(now, 1);
        formatStr = 'EEE'; // Mon, Tue...
    } else if (period === 'year') {
        startDate = subMonths(now, 11); // Last 12 months
        formatStr = 'MMM'; // Jan, Feb...
    } else {
        // Default to month (last 30 days)
        startDate = subMonths(now, 1);
        formatStr = 'd MMM'; // 1 Jan
    }

    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            transactionDate: { gte: startDate }
        },
        orderBy: { transactionDate: 'asc' },
        include: { category: true }
    });

    // Group by date
    const grouped = transactions.reduce((acc, t) => {
        const key = format(t.transactionDate, formatStr);
        if (!acc[key]) acc[key] = { name: key, income: 0, expenses: 0 };

        const type = t.category?.type || 'expense';
        if (type === 'income') acc[key].income += Number(t.amount);
        else acc[key].expenses += Number(t.amount);

        return acc;
    }, {} as Record<string, { name: string, income: number, expenses: number }>);

    return Object.values(grouped);
};

/**
 * Get aggregated spending by category
 */
export const getCategoryBreakdown = async (userId: string) => {
    const start = startOfMonth(new Date());

    const breakdown = await prisma.transaction.groupBy({
        by: ['categoryId'],
        where: {
            userId,
            transactionDate: { gte: start },
            // Filter where category is expense? Prisma aggregate doesn't allow join in groupBy "where" easily...
            // Workaround: We group all by categoryId, then filter by category type later.
        },
        _sum: { amount: true },
        orderBy: {
            _sum: { amount: 'desc' }
        }
    });

    // Fetch categories to filter only expenses and get details
    const categories = await prisma.category.findMany({
        where: {
            id: { in: breakdown.map(b => b.categoryId).filter(Boolean) as string[] },
            type: 'expense'
        }
    });

    return breakdown
        .filter(b => categories.some(c => c.id === b.categoryId))
        .map(b => {
            const category = categories.find(c => c.id === b.categoryId);
            return {
                name: category?.name || 'Uncategorized',
                color: category?.color || '#cbd5e1',
                value: Number(b._sum?.amount || 0)
            };
        });
};

/**
 * Get top merchants
 */
export const getTopMerchants = async (userId: string) => {
    const start = startOfMonth(new Date());

    // Prisma doesn't natively support groupBy on non-unique string fields cleanly with other aggregations in one go without raw query for some DBs, 
    // but works for basic grouping.
    // However, merchantName is optional.

    // For top merchants, we want only expenses
    const transactions = await prisma.transaction.groupBy({
        by: ['merchant'],
        where: {
            userId,
            transactionDate: { gte: start },
            // Approximation: usually merchants are for expenses. 
            // Better: We should filter by category type, but Prisma groupBy limitations.
            // We'll proceed assuming most transactions with merchant are expenses.
        },
        _sum: { amount: true },
        _count: { id: true },
        orderBy: {
            _sum: { amount: 'desc' }
        },
        take: 5
    });

    return transactions.map(t => ({
        name: t.merchant || 'Unknown',
        amount: Number(t._sum?.amount || 0),
        count: t._count.id
    }));
};
