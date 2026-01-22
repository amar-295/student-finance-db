import prisma from '../config/database';
import { NotFoundError } from '../utils';

/**
 * Get user profile
 */
export const getUserProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            university: true,
            graduationYear: true,
            major: true,
            phone: true,
            location: true,
            theme: true,
            dateFormat: true,
            baseCurrency: true,
            createdAt: true
        }
    });

    if (!user) throw new NotFoundError('User not found');
    return user;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, data: any) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            name: data.name,
            university: data.university,
            graduationYear: data.graduationYear,
            major: data.major,
            phone: data.phone,
            location: data.location,
            theme: data.theme,
            dateFormat: data.dateFormat,
            baseCurrency: data.baseCurrency
        },
        select: {
            id: true,
            email: true,
            name: true,
            university: true,
            graduationYear: true,
            major: true,
            phone: true,
            location: true,
            theme: true,
            dateFormat: true,
            baseCurrency: true,
            createdAt: true
        }
    });

    return user;
};
