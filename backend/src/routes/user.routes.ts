import express from 'express';
import { asyncHandler, authenticate } from '../middleware';
import { getProfile, updateProfile } from '../controllers/user.controller';

const router = express.Router();

router.use(authenticate);

router.get('/profile', asyncHandler(getProfile));
router.put('/profile', asyncHandler(updateProfile));

export default router;
