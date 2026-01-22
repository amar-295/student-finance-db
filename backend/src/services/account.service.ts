import prisma from '../config/database';
import { NotFoundError, BadRequestError } from '../utils';
import type { CreateAccountInput, UpdateAccountInput } from '../types/account.types';

/**
 * Create a new account
 */
export const createAccount = async (userId: string, input: CreateAccountInput) => {
  const account = await prisma.account.create({
    data: {
      userId,
      name: input.name,
      accountType: input.accountType,
      balance: input.balance || 0,
      currency: input.currency || 'USD',
      institution: input.institution,
      accountNumber: input.accountNumber,
    },
  });

  return account;
};

/**
 * Get all accounts for user
 */
export const getUserAccounts = async (userId: string) => {
  const accounts = await prisma.account.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return accounts;
};

/**
 * Get single account
 */
export const getAccountById = async (userId: string, accountId: string) => {
  const account = await prisma.account.findFirst({
    where: {
      id: accountId,
      userId,
      deletedAt: null,
    },
  });

  if (!account) {
    throw new NotFoundError('Account not found');
  }

  return account;
};

/**
 * Update account
 */
export const updateAccount = async (
  userId: string,
  accountId: string,
  input: UpdateAccountInput
) => {
  // Verify account belongs to user
  const existing = await prisma.account.findFirst({
    where: {
      id: accountId,
      userId,
      deletedAt: null,
    },
  });

  if (!existing) {
    throw new NotFoundError('Account not found');
  }

  const account = await prisma.account.update({
    where: { id: accountId },
    data: input,
  });

  return account;
};

/**
 * Delete account (soft delete)
 */
export const deleteAccount = async (userId: string, accountId: string) => {
  const account = await prisma.account.findFirst({
    where: {
      id: accountId,
      userId,
      deletedAt: null,
    },
  });

  if (!account) {
    throw new NotFoundError('Account not found');
  }

  // Check if account has transactions
  const transactionCount = await prisma.transaction.count({
    where: {
      accountId,
      deletedAt: null,
    },
  });

  if (transactionCount > 0) {
    throw new BadRequestError(
      `Cannot delete account with ${transactionCount} transaction(s). Delete or move transactions first.`
    );
  }

  // Soft delete
  await prisma.account.update({
    where: { id: accountId },
    data: { deletedAt: new Date() },
  });

  return { message: 'Account deleted successfully' };
};

/**
 * Transfer funds between accounts
 */
export const transferFunds = async (
  userId: string,
  input: { fromId: string; toId: string; amount: number; date: Date; note?: string }
) => {
  if (input.fromId === input.toId) {
    throw new BadRequestError('Cannot transfer to the same account');
  }

  const { fromId, toId, amount, date, note } = input;

  // Verify ownership
  const fromAccount = await prisma.account.findFirst({ where: { id: fromId, userId } });
  const toAccount = await prisma.account.findFirst({ where: { id: toId, userId } });

  if (!fromAccount || !toAccount) {
    throw new NotFoundError('One or both accounts not found');
  }

  // Find or create "Transfer" category
  let transferCategory = await prisma.category.findFirst({
    where: { name: 'Transfer', OR: [{ userId }, { isSystem: true }] }
  });

  if (!transferCategory) {
    transferCategory = await prisma.category.create({
      data: {
        name: 'Transfer',
        type: 'expense', // Neutral, but needs type
        isSystem: true,
        icon: 'swap_horiz',
        color: '#8e44ad'
      }
    });
  }

  // Execute atomic transaction
  return await prisma.$transaction(async (tx) => {
    // 1. Create debit txn (from)
    await tx.transaction.create({
      data: {
        userId,
        accountId: fromId,
        categoryId: transferCategory!.id,
        amount: -amount,
        merchant: 'Transfer to ' + toAccount.name,
        description: note || 'Transfer',
        transactionDate: date,
        status: 'cleared',
        currency: fromAccount.currency
      }
    });

    // 2. Create credit txn (to)
    await tx.transaction.create({
      data: {
        userId,
        accountId: toId,
        categoryId: transferCategory!.id,
        amount: amount,
        merchant: 'Transfer from ' + fromAccount.name,
        description: note || 'Transfer',
        transactionDate: date,
        status: 'cleared',
        currency: toAccount.currency
      }
    });

    // 3. Update balances
    await tx.account.update({
      where: { id: fromId },
      data: { balance: { decrement: amount } }
    });

    await tx.account.update({
      where: { id: toId },
      data: { balance: { increment: amount } }
    });

    return { success: true };
  });
};

/**
 * Get account balance history
 */
export const getAccountHistory = async (userId: string, accountId: string, days: number = 30) => {
  const account = await getAccountById(userId, accountId);

  // Define time window
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // We need ALL transactions after the start date to calculate history correctly
  // (Actually, we need all transactions impacting the future if we worked forward, 
  // but working backward from current balance (which is "now"), we need transactions 
  // from now back to the start date)

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      accountId,
      deletedAt: null,
      transactionDate: {
        gte: startDate,
        lte: new Date() // include up to this exact moment 
      }
    },
    orderBy: { transactionDate: 'desc' } // Process newest first
  });

  const history = [];
  let currentBalance = Number(account.balance);

  // Map txns by date string YYYY-MM-DD
  const txnsByDay: Record<string, number> = {};

  for (const t of transactions) {
    const dateStr = t.transactionDate.toISOString().split('T')[0];
    // Transaction amount: + for Income, - for Expense
    // If we are at End of Day X, and want Start of Day X (or End of Day X-1),
    // We SUBTRACT the Day X transactions.
    txnsByDay[dateStr] = (txnsByDay[dateStr] || 0) + Number(t.amount);
  }

  // Generate last 'days' days
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Push current END OF DAY balance
    history.push({
      date: dateStr,
      balance: parseFloat(currentBalance.toFixed(2))
    });

    // Adjust balance for the previous day
    // Current Balance represents "Now". 
    // To get "Yesterday's Closure", we remove "Today's Net Flow".
    // If Today Flow = +100, Yesterday was (Balance - 100).
    const dayNetFlow = txnsByDay[dateStr] || 0;
    currentBalance -= dayNetFlow;
  }

  return history.reverse();
};