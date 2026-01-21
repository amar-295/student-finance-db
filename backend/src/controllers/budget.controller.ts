import { Request, Response } from 'express';
import {
    createBudget,
    getUserBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget,
    getAllBudgetStatuses,
    getBudgetRecommendations,
    checkBudgetAlerts,
} from '../services/budget.service';
import {
    createBudgetSchema,
    updateBudgetSchema,
    budgetQuerySchema,
} from '../types/budget.types';

/**
 * Create budget
 * POST /api/budgets
 */
export const create = async (req: Request, res: Response) => {
    const input = createBudgetSchema.parse(req.body);
    const budget = await createBudget(req.user!.userId, input);

    res.status(201).json({
        success: true,
        message: 'Budget created successfully',
        data: budget,
    });
};

/**
 * Get all budgets
 * GET /api/budgets
 */
export const getAll = async (req: Request, res: Response) => {
    const query = budgetQuerySchema.parse(req.query);
    const budgets = await getUserBudgets(req.user!.userId, query);

    res.status(200).json({
        success: true,
        data: budgets,
    });
};

/**
 * Get single budget
 * GET /api/budgets/:id
 */
export const getOne = async (req: Request, res: Response) => {
    const budget = await getBudgetById(req.user!.userId, req.params.id);

    res.status(200).json({
        success: true,
        data: budget,
    });
};

/**
 * Update budget
 * PUT /api/budgets/:id
 */
export const update = async (req: Request, res: Response) => {
    const input = updateBudgetSchema.parse(req.body);
    const budget = await updateBudget(req.user!.userId, req.params.id, input);

    res.status(200).json({
        success: true,
        message: 'Budget updated successfully',
        data: budget,
    });
};

/**
 * Delete budget
 * DELETE /api/budgets/:id
 */
export const remove = async (req: Request, res: Response) => {
    const result = await deleteBudget(req.user!.userId, req.params.id);

    res.status(200).json({
        success: true,
        message: result.message,
    });
};

/**
 * Get budget status for all budgets
 * GET /api/budgets/status
 */
export const getStatus = async (req: Request, res: Response) => {
    const statuses = await getAllBudgetStatuses(req.user!.userId);

    res.status(200).json({
        success: true,
        data: statuses,
    });
};

/**
 * Get budget recommendations
 * GET /api/budgets/recommend
 */
export const getRecommendations = async (req: Request, res: Response) => {
    const recommendations = await getBudgetRecommendations(req.user!.userId);

    res.status(200).json({
        success: true,
        message: recommendations.length > 0
            ? 'Budget recommendations generated based on your spending patterns'
            : 'Not enough spending data to generate recommendations. Add more transactions!',
        data: recommendations,
    });
};

/**
 * Get budget alerts
 * GET /api/budgets/alerts
 */
export const getAlerts = async (req: Request, res: Response) => {
    const alerts = await checkBudgetAlerts(req.user!.userId);

    res.status(200).json({
        success: true,
        data: alerts,
    });
};