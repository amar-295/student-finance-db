import express from 'express';
import { asyncHandler, authenticate, validate } from '../middleware';
import { getProfile, updateProfile } from '../controllers/user.controller';
import { updateProfileSchema } from '../types/user.types';

const router = express.Router();

router.use(authenticate);

router.get('/profile', asyncHandler(getProfile));
router.put('/profile', validate(updateProfileSchema), asyncHandler(updateProfile));

export default router;
