import prisma from '../config/database';
import { categorizeTransaction } from './ai-categorization.service';
import { NotFoundError } from '../utils';
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
  GetTransactionsQuery,
  TransactionSummaryQuery,
  BulkUpdateTransactionsInput,
  BulkDeleteTransactionsInput,
} from '../types/transaction.types';

/**
 * Create a new transaction with AI categorization
 */
export const createTransaction = async (
  userId: string,
  input: CreateTransactionInput
) => {
  // Verify account belongs to user
  const account = await prisma.account.findFirst({
    where: {
      id: input.accountId,
      userId,
    },
  });

  if (!account) {
    throw new NotFoundError('Account not found or does not belong to you');
  }

  // AI categorization if category not provided
  let categoryId = input.categoryId;
  let aiCategorized = false;
  let aiConfidence = 0;

  if (!categoryId) {
    const categorization = await categorizeTransaction(
      input.merchant,
      Math.abs(input.amount)
    );

    // Find or create category
    let category = await prisma.category.findFirst({
      where: {
        name: categorization.category,
        OR: [{ userId }, { isSystem: true }],
      },
    });

    if (!category) {
      // Create user-specific category
      category = await prisma.category.create({
        data: {
          userId,
          name: categorization.category,
          type: 'expense', // AI categorized are expenses
          color: generateCategoryColor(categorization.category),
        },
      });
    }

    categoryId = category.id;
    aiCategorized = categorization.aiGenerated;
    aiConfidence = categorization.confidence;
  }

  // Create transaction and update balance atomically
  const transaction = await prisma.$transaction(async (tx) => {
    // Get category to check type
    const category = await tx.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    // Ensure expense amounts are negative and income amounts are positive
    let finalAmount = Number(input.amount);
    if (category.type === 'expense') {
      finalAmount = -Math.abs(finalAmount);
    } else if (category.type === 'income') {
      finalAmount = Math.abs(finalAmount);
    }

    // Create transaction
    const newTransaction = await tx.transaction.create({
      data: {
        userId,
        accountId: input.accountId,
        categoryId,
        amount: finalAmount,
        merchant: input.merchant,
        description: input.description,
        transactionDate: input.transactionDate
          ? new Date(input.transactionDate)
          : new Date(),
        currency: input.currency || account.currency,
        aiCategorized,
        aiConfidence,
        status: input.status,
        receiptUrl: input.receiptUrl,
      },
      include: {
        category: true,
        account: true,
      },
    });

    // Update account balance atomically
    await tx.account.update({
      where: { id: input.accountId },
      data: {
        balance: {
          increment: finalAmount,
        },
      },
    });

    return newTransaction;
  });

  return transaction;
};

/**
 * Get transactions with filtering and pagination
 */
export const getTransactions = async (
  userId: string,
  query: GetTransactionsQuery
) => {
  const {
    page = 1,
    limit = 20,
    accountId,
    categoryId,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    merchant,
    search,
    sortBy = 'date',
    sortOrder = 'desc',
  } = query;

  // Build where clause
  const where: any = {
    userId,
    deletedAt: null,
  };

  if (accountId) where.accountId = accountId;
  if (categoryId) where.categoryId = categoryId;

  if (startDate || endDate) {
    where.transactionDate = {};
    if (startDate) where.transactionDate.gte = new Date(startDate);
    if (endDate) where.transactionDate.lte = new Date(endDate);
  }

  if (minAmount !== undefined || maxAmount !== undefined) {
    where.amount = {};
    if (minAmount !== undefined) where.amount.gte = minAmount;
    if (maxAmount !== undefined) where.amount.lte = maxAmount;
  }

  if (merchant) {
    where.merchant = { contains: merchant, mode: 'insensitive' };
  }

  // Parse advanced search syntax if present
  if (search) {
    const searchTerms = search.split(' ');
    // const advancedFilters: any = []; // Unused
    const textTerms: string[] = [];

    searchTerms.forEach(term => {
      if (term.includes(':')) {
        const [key, value] = term.split(':');
        // Handle comparison operators for amount: amount:>50, amount:<50
        if (key === 'amount') {
          if (value.startsWith('>=')) where.amount = { ...where.amount, gte: parseFloat(value.substring(2)) };
          else if (value.startsWith('<=')) where.amount = { ...where.amount, lte: parseFloat(value.substring(2)) };
          else if (value.startsWith('>')) where.amount = { ...where.amount, gt: parseFloat(value.substring(1)) };
          else if (value.startsWith('<')) where.amount = { ...where.amount, lt: parseFloat(value.substring(1)) };
          else where.amount = parseFloat(value);
        } else if (key === 'category') {
          where.category = { name: { contains: value, mode: 'insensitive' } };
        } else if (key === 'merchant') {
          where.merchant = { contains: value, mode: 'insensitive' };
        } else if (key === 'status') {
          where.status = value;
        } else {
          textTerms.push(term);
        }
      } else {
        textTerms.push(term);
      }
    });

    if (textTerms.length > 0) {
      const textSearch = textTerms.join(' ');
      where.OR = [
        { merchant: { contains: textSearch, mode: 'insensitive' } },
        { description: { contains: textSearch, mode: 'insensitive' } },
        { notes: { contains: textSearch, mode: 'insensitive' } },
      ];
    }
  }

  // Build order by
  const orderBy: any = {};
  if (sortBy === 'date') orderBy.transactionDate = sortOrder;
  if (sortBy === 'amount') orderBy.amount = sortOrder;
  if (sortBy === 'merchant') orderBy.merchant = sortOrder;
  if (sortBy === 'category') orderBy.category = { name: sortOrder };

  // Get total count
  const total = await prisma.transaction.count({ where });

  // Get paginated transactions
  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      category: true,
      account: true,
    },
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    data: transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
};

/**
 * Get single transaction
 */
export const getTransactionById = async (userId: string, transactionId: string) => {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId,
      deletedAt: null,
    },
    include: {
      category: true,
      account: true,
    },
  });

  if (!transaction) {
    throw new NotFoundError('Transaction not found');
  }

  return transaction;
};

/**
 * Update transaction
 */
export const updateTransaction = async (
  userId: string,
  transactionId: string,
  input: UpdateTransactionInput
) => {
  // Check transaction exists and belongs to user
  const existing = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId,
      deletedAt: null,
    },
  });

  if (!existing) {
    throw new NotFoundError('Transaction not found');
  }

  // If changing account, verify new account belongs to user
  if (input.accountId && input.accountId !== existing.accountId) {
    const account = await prisma.account.findFirst({
      where: {
        id: input.accountId,
        userId,
      },
    });

    if (!account) {
      throw new NotFoundError('Account not found');
    }
  }

  // Update transaction and balances atomically
  const transaction = await prisma.$transaction(async (tx) => {
    // Determine new amount
    let newAmount = Number(existing.amount);

    if (input.amount !== undefined) {
      const catId = input.categoryId || existing.categoryId;

      if (!catId) {
        newAmount = parseInt(input.amount.toString());
      } else {
        const category = await tx.category.findUnique({ where: { id: catId } });
        if (category?.type === 'expense') {
          newAmount = -Math.abs(Number(input.amount));
        } else if (category?.type === 'income') {
          newAmount = Math.abs(Number(input.amount));
        } else {
          newAmount = Number(input.amount);
        }
      }
    } else if (input.categoryId && input.categoryId !== existing.categoryId) {
      // Amount didn't change, but category might have changed type
      const category = await tx.category.findUnique({ where: { id: input.categoryId } });
      if (category?.type === 'expense') {
        newAmount = -Math.abs(Number(existing.amount));
      } else if (category?.type === 'income') {
        newAmount = Math.abs(Number(existing.amount));
      }
    }

    const updatedTransaction = await tx.transaction.update({
      where: { id: transactionId },
      data: {
        accountId: input.accountId,
        categoryId: input.categoryId,
        amount: newAmount,
        transactionDate: input.transactionDate
          ? new Date(input.transactionDate)
          : undefined,
        merchant: input.merchant,
        description: input.description,
        currency: input.currency,
        notes: input.notes,
        status: input.status,
        receiptUrl: input.receiptUrl,
        // Reset AI flags if manually edited
        aiCategorized: input.categoryId ? false : existing.aiCategorized,
      },
      include: {
        category: true,
        account: true,
      },
    });

    // Update account balances atomically
    if (input.accountId && input.accountId !== existing.accountId) {
      // Account changed:
      // 1. Reverse from old account
      await tx.account.update({
        where: { id: existing.accountId },
        data: { balance: { increment: -Number(existing.amount) } },
      });
      // 2. Apply to new account
      await tx.account.update({
        where: { id: input.accountId },
        data: { balance: { increment: newAmount } },
      });
    } else {
      // Account same, check if amount changed
      if (newAmount !== Number(existing.amount)) {
        const diff = newAmount - Number(existing.amount);
        await tx.account.update({
          where: { id: existing.accountId },
          data: { balance: { increment: diff } },
        });
      }
    }

    return updatedTransaction;
  });

  return transaction;
};

/**
 * Delete transaction (soft delete)
 */
export const deleteTransaction = async (userId: string, transactionId: string) => {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId,
      deletedAt: null,
    },
  });

  if (!transaction) {
    throw new NotFoundError('Transaction not found');
  }

  // Soft delete and update balance atomically
  await prisma.$transaction(async (tx) => {
    await tx.transaction.update({
      where: { id: transactionId },
      data: { deletedAt: new Date() },
    });

    // Reverse the balance impact
    await tx.account.update({
      where: { id: transaction.accountId },
      data: { balance: { increment: -Number(transaction.amount) } },
    });
  });

  return { message: 'Transaction deleted successfully' };
};

/**
 * Get transaction summary
 */
export const getTransactionSummary = async (
  userId: string,
  query: TransactionSummaryQuery
) => {
  const { startDate, endDate } = query;

  const where: any = {
    userId,
    deletedAt: null,
  };

  if (startDate || endDate) {
    where.transactionDate = {};
    if (startDate) where.transactionDate.gte = new Date(startDate);
    if (endDate) where.transactionDate.lte = new Date(endDate);
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      category: true,
    },
  });

  // Calculate totals based on category type
  const totalIncome = transactions
    .filter(t => t.category?.type === 'income')
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  const totalExpenses = transactions
    .filter(t => t.category?.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  const netCashflow = totalIncome - totalExpenses;

  // Group by category
  const byCategory: Record<string, any> = {};
  transactions.forEach(t => {
    const categoryName = t.category?.name || 'Uncategorized';
    if (!byCategory[categoryName]) {
      byCategory[categoryName] = {
        category: categoryName,
        totalAmount: 0,
        count: 0,
        transactions: [],
      };
    }
    byCategory[categoryName].totalAmount += Number(t.amount);
    byCategory[categoryName].count += 1;
    byCategory[categoryName].transactions.push(t.id);
  });

  return {
    summary: {
      totalIncome,
      totalExpenses,
      netCashflow,
      transactionCount: transactions.length,
    },
    breakdown: Object.values(byCategory).sort(
      (a: any, b: any) => Math.abs(b.totalAmount) - Math.abs(a.totalAmount)
    ),
  };
};

/**
 * Generate color for category
 */
const generateCategoryColor = (categoryName: string): string => {
  const colors: Record<string, string> = {
    'Food & Dining': '#FF6B6B',
    'Transportation': '#4ECDC4',
    'Shopping': '#45B7D1',
    'Entertainment': '#F7B731',
    'Education': '#5F27CD',
    'Healthcare': '#00D2D3',
    'Utilities': '#FFA502',
    'Rent': '#2E86DE',
    'Groceries': '#26DE81',
    'Other': '#A5B1C2',
  };

  return colors[categoryName] || '#95A5A6';
};

/**
 * Bulk update transactions
 */
export const bulkUpdateTransactions = async (
  userId: string,
  input: BulkUpdateTransactionsInput
) => {
  const results = [];

  // We process sequentially to handle complex logic like balance updates per transaction
  for (const id of input.transactionIds) {
    try {
      const updateData: UpdateTransactionInput = {};
      if (input.categoryId) updateData.categoryId = input.categoryId;
      if (input.accountId) updateData.accountId = input.accountId;
      if (input.status) updateData.status = input.status;

      const updated = await updateTransaction(userId, id, updateData);
      results.push(updated);
    } catch (error) {
      // Continue updating others? Or fail all? 
      // For now, let's fail partial if critical, but arguably user expects "as many as possible".
      // But updateTransaction throws if not found.
      // We'll catch and log/ignore errors for missing IDs to allow others to proceed.
      console.error(`Failed to update transaction ${id}`, error);
    }
  }

  return results;
};

/**
 * Bulk delete transactions
 */
export const bulkDeleteTransactions = async (
  userId: string,
  input: BulkDeleteTransactionsInput
) => {
  const results = [];

  for (const id of input.transactionIds) {
    try {
      await deleteTransaction(userId, id);
      results.push(id);
    } catch (error) {
      console.error(`Failed to delete transaction ${id}`, error);
    }
  }

  return { deletedCount: results.length, ids: results };
};