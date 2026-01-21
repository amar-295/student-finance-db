import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils';

const prisma = new PrismaClient();

interface ParticipantInput {
    userId: string;
    amountOwed: number;
}

export const createBillSplit = async (
    creatorId: string,
    data: {
        groupId?: string;
        totalAmount: number;
        description: string;
        splitType: 'equal' | 'custom' | 'percentage';
        participants: ParticipantInput[];
    }
) => {
    const { groupId, totalAmount, description, splitType, participants } = data;

    // Validate group membership if groupId provided
    if (groupId) {
        const isMember = await prisma.groupMember.findFirst({
            where: { groupId, userId: creatorId, isActive: true },
        });
        if (!isMember) {
            throw new ApiError(403, 'You must be a member of the group to create a split in it');
        }
    }

    // Calculate amounts based on splitType if equal
    let processedParticipants = [...participants];
    if (splitType === 'equal') {
        const amountPerPerson = Math.floor((totalAmount / participants.length) * 100) / 100;
        let runningSum = 0;

        processedParticipants = participants.map((p, index) => {
            const isLast = index === participants.length - 1;
            let share = amountPerPerson;

            if (isLast) {
                // Adjust for penny leakage
                share = Math.round((totalAmount - runningSum) * 100) / 100;
            } else {
                runningSum = Math.round((runningSum + share) * 100) / 100;
            }

            return { ...p, amountOwed: share };
        });
    }

    // Validate total amount matches sum of participants (for custom/percentage)
    if (splitType !== 'equal') {
        const sum = processedParticipants.reduce((acc, p) => acc + p.amountOwed, 0);
        // Allow for small rounding differences
        if (Math.abs(sum - totalAmount) > 0.01) {
            throw new ApiError(400, `Sum of participant amounts (${sum}) does not match total amount (${totalAmount})`);
        }
    }

    return await prisma.billSplit.create({
        data: {
            groupId,
            createdBy: creatorId,
            totalAmount,
            description,
            splitType,
            status: 'pending',
            participants: {
                create: processedParticipants.map((p) => ({
                    userId: p.userId,
                    amountOwed: p.amountOwed,
                    status: 'pending',
                })),
            },
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                },
            },
            creator: {
                select: { id: true, name: true, email: true },
            },
        },
    });
};

export const getUserSplits = async (userId: string, status?: string) => {
    return await prisma.billSplit.findMany({
        where: {
            OR: [
                { createdBy: userId },
                { participants: { some: { userId } } },
            ],
            status: status as any,
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                },
            },
            creator: {
                select: { id: true, name: true, email: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
};

export const getSplitById = async (userId: string, splitId: string) => {
    const split = await prisma.billSplit.findFirst({
        where: {
            id: splitId,
            OR: [
                { createdBy: userId },
                { participants: { some: { userId } } },
            ],
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                },
            },
            creator: {
                select: { id: true, name: true, email: true },
            },
            group: true,
        },
    });

    if (!split) {
        throw new ApiError(404, 'Bill split not found');
    }

    return split;
};

export const recordPayment = async (
    userId: string,
    splitId: string,
    amount: number,
    note?: string
) => {
    const participant = await prisma.splitParticipant.findUnique({
        where: {
            splitId_userId: { splitId, userId },
        },
    });

    if (!participant) {
        throw new ApiError(404, 'You are not a participant in this bill split');
    }

    if (amount <= 0) {
        throw new ApiError(400, 'Payment amount must be greater than zero');
    }

    const newAmountPaid = Number(participant.amountPaid) + amount;
    const isFullyPaid = newAmountPaid >= Number(participant.amountOwed);

    const updatedParticipant = await prisma.splitParticipant.update({
        where: { id: participant.id },
        data: {
            amountPaid: newAmountPaid,
            status: isFullyPaid ? 'paid' : 'partial',
            paidAt: isFullyPaid ? new Date() : undefined,
            paymentNote: note,
        },
    });

    // Check if all participants have paid to update bill split status
    const allParticipants = await prisma.splitParticipant.findMany({
        where: { splitId },
    });

    const allPaid = allParticipants.every((p) => p.status === 'paid');
    const anyPaid = allParticipants.some((p) => p.status === 'paid' || p.status === 'partial');

    if (allPaid) {
        await prisma.billSplit.update({
            where: { id: splitId },
            data: { status: 'settled', settledAt: new Date() },
        });
    } else if (anyPaid) {
        await prisma.billSplit.update({
            where: { id: splitId },
            data: { status: 'partial' },
        });
    }

    return updatedParticipant;
};

export const sendReminder = async (creatorId: string, participantId: string, type: 'polite' | 'urgent') => {
    const participant = await prisma.splitParticipant.findUnique({
        where: { id: participantId },
        include: { split: true },
    });

    if (!participant) {
        throw new ApiError(404, 'Participant not found');
    }

    if (participant.split.createdBy !== creatorId) {
        throw new ApiError(403, 'Only the creator can send reminders');
    }

    if (participant.status === 'paid') {
        throw new ApiError(400, 'Participant has already paid');
    }

    return await prisma.paymentReminder.create({
        data: {
            splitParticipantId: participantId,
            sentBy: creatorId,
            reminderType: type,
        },
    });
};
