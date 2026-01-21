import { Request, Response } from 'express';
import * as billSplitService from '../services/bill-split.service';

/**
 * Get all bill splits for a user
 */
export const getAll = async (req: Request, res: Response) => {
    const { status } = req.query;
    const splits = await billSplitService.getUserSplits(req.user!.userId, status as string);
    return res.json({
        success: true,
        data: splits,
    });
};

/**
 * Get a single bill split by ID
 */
export const getById = async (req: Request, res: Response) => {
    const split = await billSplitService.getSplitById(req.user!.userId, req.params.id as string);
    return res.json({
        success: true,
        data: split,
    });
};

/**
 * Create a new bill split
 */
export const create = async (req: Request, res: Response) => {
    const { groupId, totalAmount, description, splitType, participants } = req.body;

    if (!totalAmount || !description || !splitType || !participants) {
        return res.status(400).json({
            success: false,
            message: 'Total amount, description, split type, and participants are required'
        });
    }

    const split = await billSplitService.createBillSplit(req.user!.userId, {
        groupId,
        totalAmount,
        description,
        splitType,
        participants,
    });

    return res.status(201).json({
        success: true,
        data: split,
    });
};

/**
 * Record a payment for a bill split
 */
export const recordPayment = async (req: Request, res: Response) => {
    const { amount, note } = req.body;
    if (amount === undefined) {
        return res.status(400).json({ success: false, message: 'Payment amount is required' });
    }

    const participant = await billSplitService.recordPayment(
        req.user!.userId,
        req.params.id as string,
        amount,
        note
    );

    return res.json({
        success: true,
        data: participant,
    });
};

/**
 * Send a reminder to a participant
 */
export const sendReminder = async (req: Request, res: Response) => {
    const { participantId } = req.params;
    const { type } = req.body; // 'polite' or 'urgent'

    const reminder = await billSplitService.sendReminder(
        req.user!.userId,
        participantId as string,
        type || 'polite'
    );

    return res.status(201).json({
        success: true,
        data: reminder,
    });
};
