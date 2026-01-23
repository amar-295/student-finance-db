import prisma from '../config/database';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils';

export interface CreateSplitInput {
    description: string;
    totalAmount: number;
    splitType: 'equal' | 'percentage' | 'custom';
    billDate?: string;
    participants: {
        userId: string;
        amountOwed: number;
    }[];
    groupId?: string;
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
    // Validate group membership if groupId provided
    if (input.groupId) {
        const isMember = await prisma.groupMember.findFirst({
            where: { groupId: input.groupId, userId: userId, isActive: true },
        });
        if (!isMember) {
            throw new ForbiddenError('You must be a member of the group to create a split in it');
        }
    }

    let processedParticipants = input.participants.map(p => ({ ...p }));

    // Calculate amounts based on splitType if equal - Logic from bill-split.service.ts for penny handling
    if (input.splitType === 'equal') {
        const amountPerPerson = Math.floor((input.totalAmount / input.participants.length) * 100) / 100;
        let runningSum = 0;

        processedParticipants = input.participants.map((p, index) => {
            const isLast = index === input.participants.length - 1;
            let share = amountPerPerson;

            if (isLast) {
                // Adjust for penny leakage on the last person
                share = Math.round((input.totalAmount - runningSum) * 100) / 100;
            } else {
                runningSum = Math.round((runningSum + share) * 100) / 100;
            }

            return { ...p, amountOwed: share };
        });
    } else {
        // Validate total amount matches participants (original logic)
        const participantsTotal = processedParticipants.reduce((sum, p) => sum + p.amountOwed, 0);

        // Allow small floating point difference
        if (Math.abs(participantsTotal - input.totalAmount) > 0.05) {
            throw new BadRequestError(`Participants total (${participantsTotal}) must match bill total (${input.totalAmount})`);
        }
    }

    const split = await prisma.billSplit.create({
        data: {
            createdBy: userId,
            groupId: input.groupId,
            description: input.description,
            totalAmount: input.totalAmount,
            splitType: input.splitType,
            billDate: input.billDate ? new Date(input.billDate) : new Date(),
            status: 'pending',
            participants: {
                create: processedParticipants.map(p => ({
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
            },
            group: true
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
    // Using full settlement logic as per original controller requirement
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

    // A split is settled if all participants (excluding possibly the creator if they are in the list) are paid
    // Or simpler: all participants are paid.
    const allPaid = allParticipants.every(p => p.status === 'paid');

    if (allPaid) {
        await prisma.billSplit.update({
            where: { id: splitId },
            data: { status: 'settled', settledAt: new Date() }
        });
    } else {
        // If not all settled but at least one is (which is true here because we just paid one), it is 'partial'
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

/**
 * Send a payment reminder
 * Ported from legacy bill-split.service.ts
 */
export const sendReminder = async (creatorId: string, participantId: string, type: 'polite' | 'urgent') => {
    const participant = await prisma.splitParticipant.findUnique({
        where: { id: participantId },
        include: { split: true },
    });

    if (!participant) {
        throw new NotFoundError('Participant not found');
    }

    if (participant.split.createdBy !== creatorId) {
        throw new ForbiddenError('Only the creator can send reminders');
    }

    if (participant.status === 'paid') {
        throw new BadRequestError('Participant has already paid');
    }

    return await prisma.paymentReminder.create({
        data: {
            splitParticipantId: participantId,
            sentBy: creatorId,
            reminderType: type,
        },
    });
};
