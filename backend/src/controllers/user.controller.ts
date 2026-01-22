import { Request, Response } from 'express';
import { getUserProfile, updateUserProfile } from '../services/user.service';

export const getProfile = async (req: Request, res: Response) => {
    const profile = await getUserProfile(req.user!.userId);
    res.json({ success: true, data: profile });
};

export const updateProfile = async (req: Request, res: Response) => {
    const profile = await updateUserProfile(req.user!.userId, req.body);
    res.json({ success: true, data: profile });
};
