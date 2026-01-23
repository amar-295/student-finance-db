import { Request, Response } from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  bulkUpdateTransactions,
  bulkDeleteTransactions,
} from '../services/transaction.service';

/**
 * Create a new transaction
 */
export const create = async (req: Request, res: Response) => {
  const transaction = await createTransaction(req.user!.userId, req.body);

  res.status(201).json({
    success: true,
    data: transaction,
  });
};

/**
 * Get all transactions (paginated & filtered)
 */
export const getAll = async (req: Request, res: Response) => {
  const result = await getTransactions(req.user!.userId, req.query as any);

  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
};

/**
 * Get single transaction
 */
export const getOne = async (req: Request, res: Response) => {
  const transaction = await getTransactionById(req.user!.userId, req.params.id as string);

  res.json({
    success: true,
    data: transaction,
  });
};

/**
 * Update transaction
 */
export const update = async (req: Request, res: Response) => {
  const transaction = await updateTransaction(req.user!.userId, req.params.id as string, req.body);

  res.json({
    success: true,
    data: transaction,
  });
};

/**
 * Delete transaction
 */
export const remove = async (req: Request, res: Response) => {
  const result = await deleteTransaction(req.user!.userId, req.params.id as string);

  res.json({
    success: true,
    message: result.message,
  });
};

/**
 * Get transaction summary statistics
 */
export const getSummary = async (req: Request, res: Response) => {
  const result = await getTransactionSummary(req.user!.userId, req.query as any);

  res.json({
    success: true,
    data: result,
  });
};

/**
 * Bulk update transactions
 */
export const bulkUpdate = async (req: Request, res: Response) => {
  const results = await bulkUpdateTransactions(req.user!.userId, req.body);

  res.json({
    success: true,
    data: results,
    message: `Updated ${results.length} transactions`,
  });
};

/**
 * Bulk delete transactions
 */
export const bulkDelete = async (req: Request, res: Response) => {
  const result = await bulkDeleteTransactions(req.user!.userId, req.body);

  res.json({
    success: true,
    data: result.ids,
    message: `Deleted ${result.deletedCount} transactions`,
  });
};