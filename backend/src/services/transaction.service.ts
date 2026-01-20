import prisma from '../config/database';
import { categorizeTransaction } from './ai-categorization.service';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils';
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
  GetTransactionsQuery,
  TransactionSummaryQuery,
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
      deletedAt: null,
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
    const newTransaction = await tx.transaction.create({
      data: {
        userId,
        accountId: input.accountId,
        categoryId,
        amount: input.amount,
        merchant: input.merchant,
        description: input.description,
        transactionDate: input.transactionDate
          ? new Date(input.transactionDate)
          : new Date(),
        currency: input.currency || account.currency,
        tags: input.tags,
        notes: input.notes,
        aiCategorized,
        aiConfidence,
      },
      include: {
        category: true,
        account: true,
      },
    });

    // Update account balance within same transaction
    await updateAccountBalanceInTx(tx, input.accountId);

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

  if (search) {
    where.OR = [
      { merchant: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { notes: { contains: search, mode: 'insensitive' } },
    ];
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
        deletedAt: null,
      },
    });

    if (!account) {
      throw new NotFoundError('Account not found');
    }
  }

  // Update transaction and balances atomically
  const transaction = await prisma.$transaction(async (tx) => {
    const updatedTransaction = await tx.transaction.update({
      where: { id: transactionId },
      data: {
        ...input,
        transactionDate: input.transactionDate
          ? new Date(input.transactionDate)
          : undefined,
        // Reset AI flags if manually edited
        aiCategorized: input.categoryId ? false : existing.aiCategorized,
      },
      include: {
        category: true,
        account: true,
      },
    });

    // Update account balances within same transaction
    await updateAccountBalanceInTx(tx, existing.accountId);
    if (input.accountId && input.accountId !== existing.accountId) {
      await updateAccountBalanceInTx(tx, input.accountId);
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

    // Update account balance within same transaction
    await updateAccountBalanceInTx(tx, transaction.accountId);
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
  const { startDate, endDate, groupBy = 'category' } = query;

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

  // Calculate totals
  const totalIncome = transactions
    .filter(t => Number(t.amount) > 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => Number(t.amount) < 0)
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
 * Update account balance based on transactions (within a Prisma transaction)
 */
const updateAccountBalanceInTx = async (
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  accountId: string
) => {
  const transactions = await tx.transaction.findMany({
    where: {
      accountId,
      deletedAt: null,
    },
  });

  const balance = transactions.reduce(
    (sum, t) => sum + Number(t.amount),
    0
  );

  await tx.account.update({
    where: { id: accountId },
    data: { balance },
  });
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