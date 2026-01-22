import { Request, Response } from "express";
import {
  getAnalyticsOverview,
  getSpendingTrends,
  getCategoryBreakdown,
  getTopMerchants,
} from "../services/analytics.service";

/**
 * Get analytics overview stats
 * GET /api/analytics/overview
 */
export const getOverview = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const overview = await getAnalyticsOverview(userId);

  res.json({
    success: true,
    data: overview,
  });
};

/**
 * Get spending trends
 * GET /api/analytics/trends?period=week|month|year
 */
export const getTrends = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const period = (req.query.period as "week" | "month" | "year") || "month";
  const trends = await getSpendingTrends(userId, period);

  res.json({
    success: true,
    data: trends,
  });
};

/**
 * Get category breakdown
 * GET /api/analytics/categories
 */
export const getCategories = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const breakdown = await getCategoryBreakdown(userId);

  res.json({
    success: true,
    data: breakdown,
  });
};

/**
 * Get top merchants
 * GET /api/analytics/merchants
 */
export const getMerchants = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const merchants = await getTopMerchants(userId);

  res.json({
    success: true,
    data: merchants,
  });
};

/**
 * Get AI insights
 * GET /api/analytics/ai-insights
 */
export const getInsights = async (_req: Request, res: Response) => {
  // Placeholder for AI insights logic
  // In a real app, this would analyze patterns or call an LLM
  res.json({
    success: true,
    data: [
      {
        type: "warning",
        title: "Higher than usual spending",
        message: "Your spending is up 15% compared to last week.",
      },
      {
        type: "suggestion",
        title: "Save on subscriptions",
        message: "You have 3 recurring payments totaling $45 this week.",
      },
    ],
  });
};
