import { Router } from 'express';
import * as billSplitController from '../controllers/bill-split.controller';
import { authenticate, asyncHandler } from '../middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', asyncHandler(billSplitController.getAll));
router.get('/:id', asyncHandler(billSplitController.getById));
router.post('/', asyncHandler(billSplitController.create));
router.post('/:id/payments', asyncHandler(billSplitController.recordPayment));
router.post('/participants/:participantId/remind', asyncHandler(billSplitController.sendReminder));

export default router;
