import express from 'express';
import { authenticate, asyncHandler, validate } from '../middleware';
import {
    getOverview,
    getTrends,
    getCategories,
    getMerchants,
    getInsights
} from '../controllers/analytics.controller';
import { trendsQuerySchema } from '../types/analytics.types';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticate);

/**
 * @route   GET /api/analytics/overview
 * @desc    Get analytics overview stats
 * @access  Private
 */
router.get('/overview', asyncHandler(getOverview));

/**
 * @route   GET /api/analytics/trends
 * @desc    Get spending trends
 * @access  Private
 */
router.get('/trends', validate(trendsQuerySchema, 'query'), asyncHandler(getTrends));

/**
 * @route   GET /api/analytics/categories
 * @desc    Get category breakdown
 * @access  Private
 */
router.get('/categories', asyncHandler(getCategories));

/**
 * @route   GET /api/analytics/merchants
 * @desc    Get top merchants
 * @access  Private
 */
router.get('/merchants', asyncHandler(getMerchants));

/**
 * @route   GET /api/analytics/ai-insights
 * @desc    Get AI insights
 * @access  Private
 */
router.get('/ai-insights', asyncHandler(getInsights));

export default router;
