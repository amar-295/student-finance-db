import { Request, Response } from 'express';
import {
  createAccount,
  getUserAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
  transferFunds,
  getAccountHistory
} from '../services/account.service';
import { logAction } from '../services/audit.service';

/**
 * Create account
 * POST /api/accounts
 */
export const create = async (req: Request, res: Response) => {
  const account = await createAccount(req.user!.userId, req.body);

  // Log account creation
  logAction({
    userId: req.user!.userId,
    action: 'create_account',
    entityType: 'account',
    entityId: account.id,
    ipAddress: (req.ip as string) || undefined,
    userAgent: Array.isArray(req.headers['user-agent']) ? req.headers['user-agent'][0] : req.headers['user-agent'],
    metadata: { name: account.name, type: account.accountType }
  });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: account,
  });
};

/**
 * Get all accounts
 * GET /api/accounts
 */
export const getAll = async (req: Request, res: Response) => {
  const accounts = await getUserAccounts(req.user!.userId);

  res.status(200).json({
    success: true,
    data: accounts,
  });
};

/**
 * Get single account
 * GET /api/accounts/:id
 */
/**
 * Get single account
 * GET /api/accounts/:id
 */
export const getOne = async (req: Request, res: Response) => {
  const account = await getAccountById(req.user!.userId, req.params.id as string);

  res.status(200).json({
    success: true,
    data: account,
  });
};

/**
 * Update account
 * PUT /api/accounts/:id
 */
export const update = async (req: Request, res: Response) => {
  const account = await updateAccount(req.user!.userId, req.params.id as string, req.body);

  res.status(200).json({
    success: true,
    message: 'Account updated successfully',
    data: account,
  });
};

/**
 * Delete account
 * DELETE /api/accounts/:id
 */
export const remove = async (req: Request, res: Response) => {
  const result = await deleteAccount(req.user!.userId, req.params.id as string);

  // Log account deletion
  logAction({
    userId: req.user!.userId,
    action: 'delete_account',
    entityType: 'account',
    entityId: req.params.id as string,
    ipAddress: (req.ip as string) || undefined,
    userAgent: Array.isArray(req.headers['user-agent']) ? req.headers['user-agent'][0] : req.headers['user-agent']
  });

  res.status(200).json({
    success: true,
    message: result.message,
  });
};

/**
 * Transfer funds
 * POST /api/accounts/transfer
 */
export const transfer = async (req: Request, res: Response) => {
  const result = await transferFunds(req.user!.userId, req.body);

  res.status(200).json({
    success: true,
    message: 'Transfer successful',
    data: result
  });
};

/**
 * Get account history
 * GET /api/accounts/:id/history
 */
export const getHistory = async (req: Request, res: Response) => {
  const history = await getAccountHistory(req.user!.userId, req.params.id as string, (req.query as any).days);

  res.status(200).json({
    success: true,
    data: history
  });
};