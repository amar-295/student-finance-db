import express from 'express';
import { asyncHandler, authenticate } from '../middleware';
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  getSummary,
} from '../controllers/transaction.controller';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/transactions/summary
 * @desc    Get transaction summary
 * @access  Private
 */
router.get('/summary', asyncHandler(getSummary));

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction
 * @access  Private
 */
router.post('/', asyncHandler(create));

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions with filters
 * @access  Private
 */
router.get('/', asyncHandler(getAll));

/**
 * @route   GET /api/transactions/:id
 * @desc    Get single transaction
 * @access  Private
 */
router.get('/:id', asyncHandler(getOne));

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update transaction
 * @access  Private
 */
router.put('/:id', asyncHandler(update));

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete transaction
 * @access  Private
 */
router.delete('/:id', asyncHandler(remove));

export default router;