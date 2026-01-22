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
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      accountId,
      deletedAt: null,
      transactionDate: { gte: startDate, lte: endDate }
    },
    orderBy: { transactionDate: 'asc' }
  });

  // Calculate history by working backwards/forwards?
  // Easier: Work backwards from current balance
  const history = [];
  let currentBalance = Number(account.balance);

  // We need all transactions after endDate to adjust current balance back to endDate? 
  // No, we want history up to today.

  // Strategy:
  // 1. Get current balance.
  // 2. Create daily buckets from today back to startDate.
  // 3. Subtract transactions of that day to get previous day's end balance.

  // We need transactions strictly AFTER the view window to correct the starting point if we worked forward.
  // Working backward is best.

  // Group txns by day
  const txnsByDay: Record<string, number> = {};
  transactions.forEach(t => {
    const day = t.transactionDate.toISOString().split('T')[0];
    txnsByDay[day] = (txnsByDay[day] || 0) + Number(t.amount);
  });



  // Actually current balance includes everything.
  // So balance on Day X = Balance Day X+1 - Txns on Day X+1

  // Let's generate dates
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    history.push({
      date: dateStr,
      balance: currentBalance
    });

    // Valid only if we subtract today's transactions to get yesterday's close
    const dayFlow = txnsByDay[dateStr] || 0;
    currentBalance -= dayFlow;
  }

  return history.reverse();
};