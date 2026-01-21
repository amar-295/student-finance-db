import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils';

const prisma = new PrismaClient();

export const createGroup = async (userId: string, name: string) => {
    return await prisma.group.create({
        data: {
            name,
            createdBy: userId,
            members: {
                create: {
                    userId,
                    isActive: true,
                },
            },
        },
        include: {
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
};

export const getUserGroups = async (userId: string) => {
    return await prisma.group.findMany({
        where: {
            members: {
                some: {
                    userId,
                    isActive: true,
                },
            },
        },
        include: {
            _count: {
                select: {
                    members: {
                        where: { isActive: true },
                    },
                    billSplits: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

export const getGroupById = async (userId: string, groupId: string) => {
    const group = await prisma.group.findFirst({
        where: {
            id: groupId,
            members: {
                some: {
                    userId,
                    isActive: true,
                },
            },
        },
        include: {
            members: {
                where: { isActive: true },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            billSplits: {
                orderBy: { createdAt: 'desc' },
                take: 10,
            },
        },
    });

    if (!group) {
        throw new ApiError(404, 'Group not found or you are not a member');
    }

    return group;
};

export const updateGroup = async (userId: string, groupId: string, name: string) => {
    // Check if user is the creator
    const group = await prisma.group.findFirst({
        where: {
            id: groupId,
            createdBy: userId,
        },
    });

    if (!group) {
        throw new ApiError(403, 'Only the creator can update the group name');
    }

    return await prisma.group.update({
        where: { id: groupId },
        data: { name },
    });
};

export const addMemberToGroup = async (userId: string, groupId: string, memberEmail: string) => {
    // Check if current user is a member
    const isMember = await prisma.groupMember.findFirst({
        where: {
            groupId,
            userId,
            isActive: true,
        },
    });

    if (!isMember) {
        throw new ApiError(403, 'Only group members can add others');
    }

    // Find user to add
    const userToAdd = await prisma.user.findUnique({
        where: { email: memberEmail },
    });

    if (!userToAdd) {
        throw new ApiError(404, 'User with this email not found');
    }

    // Check if already a member
    const existingMember = await prisma.groupMember.findUnique({
        where: {
            groupId_userId: {
                groupId,
                userId: userToAdd.id,
            },
        },
    });

    if (existingMember) {
        if (existingMember.isActive) {
            throw new ApiError(400, 'User is already a member of this group');
        } else {
            // Reactivate
            return await prisma.groupMember.update({
                where: { id: existingMember.id },
                data: { isActive: true },
            });
        }
    }

    return await prisma.groupMember.create({
        data: {
            groupId,
            userId: userToAdd.id,
            isActive: true,
        },
    });
};

export const removeMemberFromGroup = async (userId: string, groupId: string, memberId: string) => {
    // Check if group exists and user is creator
    const group = await prisma.group.findFirst({
        where: {
            id: groupId,
            createdBy: userId,
        },
    });

    if (!group) {
        // If not creator, user can only remove themselves
        if (userId !== memberId) {
            throw new ApiError(403, 'Only the creator can remove other members');
        }
    }

    // Cannot remove creator
    if (memberId === group?.createdBy) {
        throw new ApiError(400, 'The creator cannot be removed from the group');
    }

    return await prisma.groupMember.update({
        where: {
            groupId_userId: {
                groupId,
                userId: memberId,
            },
        },
        data: { isActive: false },
    });
};
