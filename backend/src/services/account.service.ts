import prisma from '../config/database';
import { NotFoundError } from '../utils';
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
    throw new Error(
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