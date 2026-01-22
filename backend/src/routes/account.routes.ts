import express from 'express';
import { asyncHandler, authenticate } from '../middleware';
import {
    create,
    getAll,
    getOne,
    update,
    remove,
    transfer,
    getHistory,
} from '../controllers/account.controller';

const router = express.Router();

router.use(authenticate);

/**
 * @route   POST /api/accounts
 * @desc    Create a new account
 * @access  Private
 */
router.post('/', asyncHandler(create));

/**
 * @route   GET /api/accounts
 * @desc    Get all accounts
 * @access  Private
 */
router.get('/', asyncHandler(getAll));

/**
 * @route   POST /api/accounts/transfer
 * @desc    Transfer funds between accounts
 * @access  Private
 */
router.post('/transfer', asyncHandler(transfer));

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

/**
 * @route   GET /api/accounts/:id/history
 * @desc    Get account balance history
 * @access  Private
 */
router.get('/:id/history', asyncHandler(getHistory));

export default router;