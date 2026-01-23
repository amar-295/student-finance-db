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
    getBudgetTransactions,
    getBudgetAnalytics,
} from '../services/budget.service';

/**
 * Create budget
 * POST /api/budgets
 */
export const create = async (req: Request, res: Response) => {
    const budget = await createBudget(req.user!.userId, req.body);

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
    const budgets = await getUserBudgets(req.user!.userId, req.query as any);

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
    const budget = await getBudgetById(req.user!.userId, req.params.id as string);

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
    const budget = await updateBudget(req.user!.userId, req.params.id as string, req.body);

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
    const result = await deleteBudget(req.user!.userId, req.params.id as string);

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

    res.json({
        success: true,
        data: alerts,
    });
};

/**
 * Get transactions for a budget
 * GET /api/budgets/:id/transactions
 */
export const getTransactions = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const budgetId = req.params.id as string;

    const transactions = await getBudgetTransactions(
        userId,
        budgetId,
        req.query as any
    );

    res.json({
        success: true,
        data: transactions
    });
};

/**
 * Get analytics for a budget
 * GET /api/budgets/:id/analytics
 */
export const getAnalytics = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const budgetId = req.params.id as string;

    const analytics = await getBudgetAnalytics(userId, budgetId);

    res.json({
        success: true,
        data: analytics
    });
};