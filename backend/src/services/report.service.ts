import prisma from '../config/database';
import { startOfMonth, endOfMonth } from 'date-fns';

/**
 * Generate Monthly Financial Report
 */
export const generateMonthlyReport = async (userId: string, date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    // 1. Get Income vs Expense
    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            transactionDate: { gte: start, lte: end },
            deletedAt: null
        },
        include: { category: true }
    });

    const income = transactions
        .filter(t => Number(t.amount) > 0)
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
        .filter(t => Number(t.amount) < 0)
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    // 2. Category Breakdown
    const byCategory: Record<string, number> = {};
    transactions.forEach(t => {
        if (Number(t.amount) < 0 && t.category) {
            const catName = t.category.name;
            byCategory[catName] = (byCategory[catName] || 0) + Math.abs(Number(t.amount));
        }
    });

    // 3. Opening/Closing Balance (Approximate across all accounts)
    // This is expensive to calculate precisely without snapshots, so we'll just sum current balances for "Closing" 
    // and subtract this month's flow for "Opening".
    // Note: This assumes "Closing" is "Now" if report is for current month. 
    // If report is for past month, we need to subtract all txns since then.

    const allAccounts = await prisma.account.findMany({ where: { userId, deletedAt: null } });
    const currentTotalBalance = allAccounts.reduce((sum, a) => sum + Number(a.balance), 0);

    // Txns AFTER this report period
    const futureTxns = await prisma.transaction.aggregate({
        where: {
            userId,
            transactionDate: { gt: end },
            deletedAt: null
        },
        _sum: { amount: true }
    });

    const closingBalance = currentTotalBalance - (Number(futureTxns._sum.amount) || 0);
    const netFlow = income - expenses; // This is technically approximate since it ignores transfers if they aren't zero-sum, but transfers should be zero-sum.
    const openingBalance = closingBalance - netFlow;

    return {
        period: { start, end },
        summary: {
            openingBalance,
            income,
            expenses,
            netFlow,
            closingBalance
        },
        byCategory: Object.entries(byCategory).map(([name, amount]) => ({ name, amount })),
        transactions: transactions.map(t => ({
            date: t.transactionDate,
            merchant: t.merchant,
            amount: Number(t.amount),
            category: t.category?.name || 'Uncategorized',
            type: Number(t.amount) >= 0 ? 'income' : 'expense'
        }))
    };
};

/**
 * Generate Spending Report (Custom Date Range)
 */
export const generateSpendingReport = async (userId: string, startDate: Date, endDate: Date) => {
    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            transactionDate: { gte: startDate, lte: endDate },
            deletedAt: null,
            amount: { lt: 0 } // Only expenses
        },
        include: { category: true },
        orderBy: { transactionDate: 'desc' }
    });

    const total = transactions.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    // Top Merchants
    const byMerchant: Record<string, number> = {};
    transactions.forEach(t => {
        const merch = t.merchant || 'Unknown';
        byMerchant[merch] = (byMerchant[merch] || 0) + Math.abs(Number(t.amount));
    });

    const topMerchants = Object.entries(byMerchant)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, amount]) => ({ name, amount }));

    return {
        period: { start: startDate, end: endDate },
        totalSpending: total,
        topMerchants,
        transactionCount: transactions.length,
        transactions: transactions.map(t => ({
            date: t.transactionDate,
            merchant: t.merchant,
            amount: Math.abs(Number(t.amount)),
            category: t.category?.name
        }))
    };
};
