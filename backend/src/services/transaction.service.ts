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
  } else {
    // Security Check: Verify category belongs to user or is system
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        OR: [{ userId }, { isSystem: true }],
      },
    });

    if (!category) {
      throw new NotFoundError('Category not found or you do not have permission to use it');
    }
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
        const parts = term.split(':');
        const key = parts[0];
        const value = parts[1] ?? '';
        // Handle comparison operators for amount: amount:>50, amount:<50
        if (key === 'amount' && value) {
          if (value.startsWith('>=')) where.amount = { ...where.amount, gte: parseFloat(value.substring(2)) };
          else if (value.startsWith('<=')) where.amount = { ...where.amount, lte: parseFloat(value.substring(2)) };
          else if (value.startsWith('>')) where.amount = { ...where.amount, gt: parseFloat(value.substring(1)) };
          else if (value.startsWith('<')) where.amount = { ...where.amount, lt: parseFloat(value.substring(1)) };
          else where.amount = parseFloat(value);
        } else if (key === 'category' && value) {
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
      // Verify usage checking new category
      const category = await tx.category.findFirst({
        where: {
          id: input.categoryId,
          OR: [{ userId }, { isSystem: true }],
        }
      });

      if (!category) {
        throw new NotFoundError('Category not found or access denied');
      }

      // Amount didn't change, but category might have changed type
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

  // Optimize: Use Prisma Aggregations instead of fetching all records

  // 1. Get totals by category ID
  const categoryStats = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where,
    _sum: { amount: true },
    _count: { id: true },
  });

  // 2. Fetch required categories to get metadata (name, type)
  // categoryId can be null, filter those out
  const categoryIds = categoryStats
    .map(s => s.categoryId)
    .filter((id): id is string => id !== null);

  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } }
  });

  const categoryMap = new Map(categories.map(c => [c.id, c]));

  // 3. Aggregate results
  let totalIncome = 0;
  let totalExpenses = 0;
  const byCategory: Record<string, any> = {};

  // Initialize Uncategorized if needed
  const uncategorizedStats = categoryStats.find(s => s.categoryId === null);
  if (uncategorizedStats) {
    const amount = Number(uncategorizedStats._sum.amount || 0);
    if (amount > 0) totalIncome += amount;
    else totalExpenses += Math.abs(amount);

    byCategory['Uncategorized'] = {
      category: 'Uncategorized',
      totalAmount: amount,
      count: uncategorizedStats._count.id,
      isIncome: amount > 0,
      color: '#95A5A6'
    };
  }

  for (const stat of categoryStats) {
    if (!stat.categoryId) continue; // Handled above

    const category = categoryMap.get(stat.categoryId);
    const amount = Number(stat._sum.amount || 0);
    const count = stat._count.id;
    const categoryName = category?.name || 'Unknown';

    if (category?.type === 'income') {
      totalIncome += Math.abs(amount); // Typically positive
    } else {
      totalExpenses += Math.abs(amount); // Typically negative, but we want magnitude
    }

    if (!byCategory[categoryName]) {
      byCategory[categoryName] = {
        category: categoryName,
        totalAmount: 0,
        count: 0,
        isIncome: category?.type === 'income',
        color: category ? category.color : generateCategoryColor(categoryName)
      };
    }

    byCategory[categoryName].totalAmount += amount;
    byCategory[categoryName].count += count;
  }

  const netCashflow = totalIncome - totalExpenses;

  return {
    summary: {
      totalIncome,
      totalExpenses,
      netCashflow,
      transactionCount: await prisma.transaction.count({ where }),
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
  if (!input.transactionIds.length) return { deletedCount: 0, ids: [] };

  // Fetch transactions to verify ownership and calculate balance adjustments
  const transactions = await prisma.transaction.findMany({
    where: {
      id: { in: input.transactionIds },
      userId,
      deletedAt: null
    },
    select: {
      id: true,
      amount: true,
      accountId: true
    }
  });

  if (transactions.length === 0) {
    return { deletedCount: 0, ids: [] };
  }

  const idsToDelete = transactions.map(t => t.id);

  // Group refund amounts by account
  const accountAdjustments = new Map<string, number>();
  for (const t of transactions) {
    const current = accountAdjustments.get(t.accountId) || 0;
    // To reverse the transaction, we subtract the amount.
    // If expense (-100), we decrement by -100 = +100.
    // If income (+100), we decrement by 100 = -100.
    // Wait, logic in single delete is: balance: { increment: -Number(transaction.amount) }
    // So we sum up the NEGATIVE of transaction amounts.
    accountAdjustments.set(t.accountId, current - Number(t.amount));
  }

  // Execute updates in transaction
  await prisma.$transaction(async (tx) => {
    // 1. Soft delete all
    await tx.transaction.updateMany({
      where: { id: { in: idsToDelete } },
      data: { deletedAt: new Date() }
    });

    // 2. Update account balances - requires one query per account affected
    // Usually bulk delete is for the same account, but let's handle multiple
    for (const [accountId, adjustment] of accountAdjustments.entries()) {
      if (adjustment !== 0) {
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { increment: adjustment } }
        });
      }
    }
  });

  return { deletedCount: idsToDelete.length, ids: idsToDelete };
};