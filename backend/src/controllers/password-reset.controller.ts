
import { Request, Response, NextFunction } from 'express';
import * as PasswordResetService from '../services/password-reset.service';
import { requestPasswordResetSchema, resetPasswordSchema, verifyResetTokenSchema } from '../types/password-reset.types';

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = requestPasswordResetSchema.parse(req.body);
        const result = await PasswordResetService.requestPasswordReset(input);
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
        const input = verifyResetTokenSchema.parse(req.body);
        const result = await PasswordResetService.verifyResetToken(input);
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
        const input = resetPasswordSchema.parse(req.body);
        const result = await PasswordResetService.resetPassword(input);
        res.status(200).json({
            success: true,
            message: result.message,
            data: { email: result.email },
        });
    } catch (error) {
        next(error);
    }
};
