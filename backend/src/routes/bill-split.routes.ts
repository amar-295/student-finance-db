import express from 'express';
import { asyncHandler, authenticate } from '../middleware';
import {
    create,
    getAll,
    getOne,
    settleShare,
    remove,
    addComment,
    getComments,
    sendReminderController
} from '../controllers/bill-split.controller';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/splits
 * @desc    Get all bill splits
 * @access  Private
 */
router.get('/', asyncHandler(getAll));

/**
 * @route   POST /api/splits
 * @desc    Create new split
 * @access  Private
 */
router.post('/', asyncHandler(create));

/**
 * @route   GET /api/splits/:id
 * @desc    Get split details
 * @access  Private
 */
router.get('/:id', asyncHandler(getOne));

/**
 * @route   PUT /api/splits/:id/settle
 * @desc    Settle a participant's share
 * @access  Private
 */
router.put('/:id/settle', asyncHandler(settleShare));

/**
 * @route   DELETE /api/splits/:id
 * @desc    Delete split
 * @access  Private
 */
router.delete('/:id', asyncHandler(remove));

/**
 * @route   POST /api/splits/:id/comments
 * @desc    Add comment to split
 * @access  Private
 */
router.post('/:id/comments', asyncHandler(addComment));

/**
 * @route   GET /api/splits/:id/comments
 * @desc    Get split comments
 * @access  Private
 */
router.get('/:id/comments', asyncHandler(getComments));

/**
 * @route   POST /api/splits/:id/reminders
 * @desc    Send payment reminder
 * @access  Private
 */
router.post('/:id/reminders', asyncHandler(sendReminderController));

export default router;
