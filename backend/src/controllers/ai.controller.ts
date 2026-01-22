import { Request, Response } from "express";
import {
  calculateHealthScore,
  detectSubscriptions,
  getRecommendations,
} from "../services/ai.service";

/**
 * Get AI insights and score
 * GET /api/ai/insights
 */
export const getInsights = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const score = await calculateHealthScore(userId);

  res.json({
    success: true,
    data: {
      score,
      message:
        score.total > 80
          ? "Excellent financial health!"
          : "Room for improvement.",
    },
  });
};

/**
 * Get detected subscriptions
 * GET /api/ai/subscriptions
 */
export const getSubscriptions = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const subscriptions = await detectSubscriptions(userId);

  res.json({
    success: true,
    data: subscriptions,
  });
};

/**
 * Get recommendations
 * GET /api/ai/recommendations
 */
export const getRecommendationsHandler = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user!.userId;
  const recs = await getRecommendations(userId);

  res.json({
    success: true,
    data: recs,
  });
};

/**
 * Get spending patterns (Mock for heatmap)
 * GET /api/ai/patterns
 */
export const getPatterns = async (_req: Request, res: Response) => {
  // In real app, aggregate by day of week / hour
  res.json({
    success: true,
    data: {
      peakDay: "Friday",
      peakCategory: "Dining",
      weekendSpendIncrease: 30,
    },
  });
};
