import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiError } from '../utils';

/**
 * Get all categories
 * Filter by type (income/expense) via query param
 */
export const getAll = async (req: Request, res: Response) => {
    const type = req.query.type as string | undefined;
    const isSystem = req.query.isSystem as string | undefined;

    const where: any = {};

    // Filter by type if provided
    if (type) {
        where.type = type;
    }

    // Filter by system/custom status if provided
    if (isSystem !== undefined) {
        where.isSystem = isSystem === 'true';
    }

    // Include user-specific categories OR system categories
    if (req.user) {
        where.OR = [
            { userId: req.user.userId },
            { isSystem: true }
        ];
    } else {
        where.isSystem = true;
    }

    const categories = await prisma.category.findMany({
        where,
        orderBy: { name: 'asc' },
    });

    res.json({
        success: true,
        count: categories.length,
        data: categories,
    });
};

/**
 * Get single category
 */
export const getOne = async (req: Request, res: Response) => {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
        where: { id: id as string },
    });

    if (!category) {
        throw new ApiError(404, 'Category not found');
    }

    res.json({
        success: true,
        data: category,
    });
};

/**
 * Create custom category
 */
export const create = async (req: Request, res: Response) => {
    const { name, type, icon, color } = req.body;
    const userId = req.user!.userId;

    // Check valid type
    if (!['income', 'expense'].includes(type)) {
        throw new ApiError(400, "Type must be 'income' or 'expense'");
    }

    const category = await prisma.category.create({
        data: {
            name,
            type,
            icon,
            color,
            isSystem: false,
            userId,
        },
    });

    res.status(201).json({
        success: true,
        data: category,
    });
};
