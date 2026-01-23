import { Request, Response, NextFunction } from 'express';
import * as PasswordResetService from '../services/password-reset.service';

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await PasswordResetService.requestPasswordReset(req.body);
        res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

export const verifyResetToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await PasswordResetService.verifyResetToken(req.body);
        res.status(200).json({
            success: true,
            message: 'Reset token is valid',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await PasswordResetService.resetPassword(req.body);
        res.status(200).json({
            success: true,
            message: result.message,
            data: { email: result.email },
        });
    } catch (error) {
        next(error);
    }
};
