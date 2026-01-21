import { Request, Response } from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
} from '../services/transaction.service';
import {
  createTransactionSchema,
  updateTransactionSchema,
  getTransactionsQuerySchema,
  transactionSummarySchema,
} from '../types/transaction.types';
import { logAction } from '../services/audit.service';

/**
 * Create a new transaction
 * POST /api/transactions
 */
export const create = async (req: Request, res: Response) => {
  const input = createTransactionSchema.parse(req.body);
  const transaction = await createTransaction(req.user!.userId, input);

  // Log transaction creation
  logAction({
    userId: req.user!.userId,
    action: 'create_transaction',
    entityType: 'transaction',
    entityId: transaction.id,
    ipAddress: (req.ip as string) || undefined,
    userAgent: (req.headers['user-agent'] as string) || undefined,
    metadata: {
      amount: transaction.amount,
      category: transaction.category?.name,
      merchant: transaction.merchant
    }
  });

  res.status(201).json({
    success: true,
    message: 'Transaction created successfully',
    data: transaction,
  });
};

/**
 * Get all transactions with filters
 * GET /api/transactions
 */
export const getAll = async (req: Request, res: Response) => {
  const query = getTransactionsQuerySchema.parse(req.query);
  const result = await getTransactions(req.user!.userId, query);

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
};

/**
 * Get single transaction
 * GET /api/transactions/:id
 */
export const getOne = async (req: Request, res: Response) => {
  const transaction = await getTransactionById(
    req.user!.userId,
    req.params.id as string
  );

  res.status(200).json({
    success: true,
    data: transaction,
  });
};

/**
 * Update transaction
 * PUT /api/transactions/:id
 */
export const update = async (req: Request, res: Response) => {
  const input = updateTransactionSchema.parse(req.body);
  const transaction = await updateTransaction(
    req.user!.userId,
    req.params.id as string,
    input
  );

  res.status(200).json({
    success: true,
    message: 'Transaction updated successfully',
    data: transaction,
  });
};

/**
 * Delete transaction
 * DELETE /api/transactions/:id
 */
export const remove = async (req: Request, res: Response) => {
  const result = await deleteTransaction(req.user!.userId, req.params.id as string);

  // Log transaction deletion
  logAction({
    userId: req.user!.userId,
    action: 'delete_transaction',
    entityType: 'transaction',
    entityId: (req.params.id as string) || undefined,
    ipAddress: (req.ip as string) || undefined,
    userAgent: (req.headers['user-agent'] as string) || undefined
  });

  res.status(200).json({
    success: true,
    message: result.message,
  });
};

/**
 * Get transaction summary
 * GET /api/transactions/summary
 */
export const getSummary = async (req: Request, res: Response) => {
  const query = transactionSummarySchema.parse(req.query);
  const summary = await getTransactionSummary(req.user!.userId, query);

  res.status(200).json({
    success: true,
    data: summary,
  });
};