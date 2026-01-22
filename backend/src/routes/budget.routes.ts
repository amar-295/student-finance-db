import express from 'express';
import { asyncHandler, authenticate } from '../middleware';
import {
    create,
    getAll,
    getOne,
    update,
    remove,
    getStatus,
    getRecommendations,
    getAlerts,
    getTransactions,
    getAnalytics,
} from '../controllers/budget.controller';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/budgets/status
 * @desc    Get status of all active budgets
 * @access  Private
 */
router.get('/status', asyncHandler(getStatus));

/**
 * @route   GET /api/budgets/recommend
 * @desc    Get budget recommendations based on spending patterns
 * @access  Private
 */
router.get('/recommend', asyncHandler(getRecommendations));

/**
 * @route   GET /api/budgets/alerts
 * @desc    Get budget alerts (exceeded, warnings)
 * @access  Private
 */
router.get('/alerts', asyncHandler(getAlerts));

/**
 * @route   GET /api/budgets/:id/transactions
 * @desc    Get transactions for a specific budget
 * @access  Private
 */
router.get('/:id/transactions', asyncHandler(getTransactions));

/**
 * @route   GET /api/budgets/:id/analytics
 * @desc    Get analytics for a specific budget
 * @access  Private
 */
router.get('/:id/analytics', asyncHandler(getAnalytics));

/**
 * @route   POST /api/budgets
 * @desc    Create a new budget
 * @access  Private
 */
router.post('/', asyncHandler(create));

/**
 * @route   GET /api/budgets
 * @desc    Get all budgets (with optional filters)
 * @access  Private
 */
router.get('/', asyncHandler(getAll));

/**
 * @route   GET /api/budgets/:id
 * @desc    Get single budget
 * @access  Private
 */
router.get('/:id', asyncHandler(getOne));

/**
 * @route   PUT /api/budgets/:id
 * @desc    Update budget
 * @access  Private
 */
router.put('/:id', asyncHandler(update));

/**
 * @route   DELETE /api/budgets/:id
 * @desc    Delete budget
 * @access  Private
 */
router.delete('/:id', asyncHandler(remove));

export default router;