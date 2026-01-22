import { Request, Response } from 'express';
import { z } from 'zod';
import {
    createBillSplit,
    getUserSplits,
    getBillSplitById,
    settleParticipantShare,
    deleteBillSplit,
    addSplitComment,
    getSplitComments,
    CreateSplitInput
} from '../services/billSplit.service';

// Validation Schemas
const participantSchema = z.object({
    userId: z.string(),
    amountOwed: z.number().min(0)
});

const commentSchema = z.object({
    content: z.string().min(1)
});

const createSplitSchema = z.object({
    description: z.string().min(1),
    totalAmount: z.number().positive(),
    splitType: z.enum(['equal', 'percentage', 'custom']),
    billDate: z.string().optional(),
    participants: z.array(participantSchema).min(1)
});

const settleShareSchema = z.object({
    participantId: z.string()
});

/**
 * Create a new bill split
 * POST /api/splits
 */
export const create = async (req: Request, res: Response) => {
    const input = createSplitSchema.parse(req.body);
    // Explicitly cast the string literal type to the union type required by the service
    const serviceInput: CreateSplitInput = {
        ...input,
        splitType: input.splitType as 'equal' | 'percentage' | 'custom'
    };

    const split = await createBillSplit(req.user!.userId, serviceInput);

    res.status(201).json({
        success: true,
        data: split
    });
};

/**
 * Get all splits for user
 * GET /api/splits
 */
export const getAll = async (req: Request, res: Response) => {
    const splits = await getUserSplits(req.user!.userId);

    res.json({
        success: true,
        data: splits
    });
};

/**
 * Get single split
 * GET /api/splits/:id
 */
export const getOne = async (req: Request, res: Response) => {
    const split = await getBillSplitById(req.user!.userId, req.params.id as string);

    res.json({
        success: true,
        data: split
    });
};

/**
 * Settle a participant's share
 * PUT /api/splits/:id/settle
 * Body: { participantId: string }
 */
export const settleShare = async (req: Request, res: Response) => {
    const { participantId } = settleShareSchema.parse(req.body);
    const result = await settleParticipantShare(req.user!.userId, req.params.id as string, participantId);

    res.json({
        success: true,
        message: result.message
    });
};

/**
 * Delete a split
 * DELETE /api/splits/:id
 */
export const remove = async (req: Request, res: Response) => {
    const result = await deleteBillSplit(req.user!.userId, req.params.id as string);

    res.json({
        success: true,
        message: result.message
    });
};

/**
 * Add a comment
 * POST /api/splits/:id/comments
 */
export const addComment = async (req: Request, res: Response) => {
    const { content } = commentSchema.parse(req.body);
    const comment = await addSplitComment(req.user!.userId, req.params.id as string, content);

    res.status(201).json({
        success: true,
        data: comment
    });
};

/**
 * Get comments
 * GET /api/splits/:id/comments
 */
export const getComments = async (req: Request, res: Response) => {
    const comments = await getSplitComments(req.user!.userId, req.params.id as string);

    res.json({
        success: true,
        data: comments
    });
};
