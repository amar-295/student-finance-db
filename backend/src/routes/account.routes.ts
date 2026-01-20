import express from 'express';
import { asyncHandler, authenticate } from '../middleware';
import { create, getAll, getOne, update, remove } from '../controllers/account.controller';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/accounts
 * @desc    Create a new account
 * @access  Private
 */
router.post('/', asyncHandler(create));

/**
 * @route   GET /api/accounts
 * @desc    Get all user accounts
 * @access  Private
 */
router.get('/', asyncHandler(getAll));

/**
 * @route   GET /api/accounts/:id
 * @desc    Get single account
 * @access  Private
 */
router.get('/:id', asyncHandler(getOne));

/**
 * @route   PUT /api/accounts/:id
 * @desc    Update account
 * @access  Private
 */
router.put('/:id', asyncHandler(update));

/**
 * @route   DELETE /api/accounts/:id
 * @desc    Delete account
 * @access  Private
 */
router.delete('/:id', asyncHandler(remove));

export default router;