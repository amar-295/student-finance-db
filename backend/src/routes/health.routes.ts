import express from 'express';
import { asyncHandler } from '../middleware';
import { healthCheck, detailedHealthCheck, getMetrics } from '../controllers/health.controller';

const router = express.Router();

/**
 * @route   GET /health
 * @desc    Basic health check
 * @access  Public
 */
router.get('/', healthCheck);

/**
 * @route   GET /health/metrics
 * @desc    Get Prometheus metrics
 * @access  Public
 */
router.get('/metrics', asyncHandler(getMetrics));

/**
 * @route   GET /health/detailed
 * @desc    Detailed health check with database status
 * @access  Public
 */
router.get('/detailed', asyncHandler(detailedHealthCheck));

export default router;
