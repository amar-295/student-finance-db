import prisma from '../config/database';
import { NotFoundError, BadRequestError } from '../utils';

export interface CreateSplitInput {
    description: string;
    totalAmount: number;
    splitType: 'equal' | 'percentage' | 'custom';
    billDate?: string;
    participants: {
        userId: string;
        amountOwed: number;
    }[];
}

export interface UpdateSplitPaymentInput {
    participantId: string;
    amountPaid: number;
    paymentMethod?: string;
    paymentNote?: string;
}

/**
 * Create a new bill split
 */
export const createBillSplit = async (userId: string, input: CreateSplitInput) => {
    // Validate total amount matches participants
    const participantsTotal = input.participants.reduce((sum, p) => sum + p.amountOwed, 0);

    // Allow small floating point difference
    if (Math.abs(participantsTotal - input.totalAmount) > 0.05) {
        throw new BadRequestError(`Participants total (${participantsTotal}) must match bill total (${input.totalAmount})`);
    }

    const split = await prisma.billSplit.create({
        data: {
            createdBy: userId,
            description: input.description,
            totalAmount: input.totalAmount,
            splitType: input.splitType,
            billDate: input.billDate ? new Date(input.billDate) : new Date(),
            status: 'pending',
            participants: {
                create: input.participants.map(p => ({
                    userId: p.userId,
                    amountOwed: p.amountOwed,
                    status: 'pending'
                }))
            }
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            },
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    return split;
};

/**
 * Get all splits for a user (created or participating)
 */
export const getUserSplits = async (userId: string) => {
    const splits = await prisma.billSplit.findMany({
        where: {
            OR: [
                { createdBy: userId },
                {
                    participants: {
                        some: { userId }
                    }
                }
            ],
            deletedAt: null
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            },
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return splits;
};

/**
 * Get single split details
 */
export const getBillSplitById = async (userId: string, splitId: string) => {
    const split = await prisma.billSplit.findFirst({
        where: {
            id: splitId,
            OR: [
                { createdBy: userId },
                {
                    participants: {
                        some: { userId }
                    }
                }
            ],
            deletedAt: null
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            },
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    if (!split) {
        throw new NotFoundError('Bill split not found');
    }

    return split;
};

/**
 * Settle a participant's share
 * Usually called by the creator to confirm they received payment
 */
export const settleParticipantShare = async (userId: string, splitId: string, targetParticipantUserId: string) => {
    // Verify the user is the creator of the split
    const split = await prisma.billSplit.findFirst({
        where: { id: splitId, createdBy: userId }
    });

    if (!split) {
        throw new NotFoundError('Split not found or you do not have permission to settle it');
    }

    // Find the participant record
    const participant = await prisma.splitParticipant.findFirst({
        where: {
            splitId,
            userId: targetParticipantUserId
        }
    });

    if (!participant) {
        throw new NotFoundError('Participant not found in this split');
    }

    // Update participant status
    await prisma.splitParticipant.update({
        where: { id: participant.id },
        data: {
            status: 'paid',
            paidAt: new Date(),
            amountPaid: participant.amountOwed // Assume full payment
        }
    });

    // Check if all participants are paid to update main split status
    const allParticipants = await prisma.splitParticipant.findMany({
        where: { splitId }
    });

    const allPaid = allParticipants.every(p => p.status === 'paid' || p.userId === userId); // Creator usually doesn't pay themselves in the system logic, strictly speaking

    if (allPaid) {
        await prisma.billSplit.update({
            where: { id: splitId },
            data: { status: 'settled', settledAt: new Date() }
        });
    } else {
        // If not all settled but at least one is, it might be 'partial'
        await prisma.billSplit.update({
            where: { id: splitId },
            data: { status: 'partial' }
        });
    }

    return { message: 'Participant share settled successfully' };
};


/**
 * Delete a split
 */
export const deleteBillSplit = async (userId: string, splitId: string) => {
    const split = await prisma.billSplit.findFirst({
        where: { id: splitId, createdBy: userId }
    });

    if (!split) {
        throw new NotFoundError('Split not found or permission denied');
    }

    await prisma.billSplit.update({
        where: { id: splitId },
        data: { deletedAt: new Date() }
    });

    return { message: 'Split deleted successfully' };
};

/**
 * Add a comment to a split
 */
export const addSplitComment = async (userId: string, splitId: string, content: string) => {
    // Verify access
    const split = await prisma.billSplit.findFirst({
        where: {
            id: splitId,
            OR: [
                { createdBy: userId },
                { participants: { some: { userId } } }
            ]
        }
    });

    if (!split) {
        throw new NotFoundError('Split not found or permission denied');
    }

    const comment = await prisma.splitComment.create({
        data: {
            splitId,
            userId,
            content
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    return comment;
};

/**
 * Get comments for a split
 */
export const getSplitComments = async (userId: string, splitId: string) => {
    // Verify access
    const split = await prisma.billSplit.findFirst({
        where: {
            id: splitId,
            OR: [
                { createdBy: userId },
                { participants: { some: { userId } } }
            ]
        }
    });

    if (!split) {
        throw new NotFoundError('Split not found or permission denied');
    }

    const comments = await prisma.splitComment.findMany({
        where: { splitId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    return comments;
};
