// ============================================================================
// FILE: src/services/ai-insights.service.ts
// Copy this entire file to: student-finance-backend/src/services/ai-insights.service.ts
// ============================================================================

import axios from "axios";
import prisma from "../config/database";
import { getRedisClient } from "../config/redis";

/**
 * AI Insights Generator (100% FREE)
 *
 * Generates spending insights using:
 * 1. Statistical analysis (always free)
 * 2. Hugging Face AI for natural language generation (optional, free)
 *
 * No credit card required
 */

const HF_API_URL = "https://api-inference.huggingface.co/models/";
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;

interface SpendingData {
  totalSpent: number;
  categoryBreakdown: Record<string, number>;
  weekComparison: { thisWeek: number; lastWeek: number };
  budgetStatus: Record<string, { spent: number; limit: number }>;
  topMerchants: Array<{ merchant: string; amount: number; count: number }>;
}

interface Insight {
  id: string;
  type: "warning" | "positive" | "tip" | "prediction";
  title: string;
  message: string;
  actionType?: string;
  actionData?: any;
  priority: number;
}

/**
 * Analyze user spending and generate insights
 */
export const generateInsights = async (userId: string): Promise<Insight[]> => {
  // Check cache
  const redis = getRedisClient();
  const cacheKey = `insights:${userId}`;

  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn("Redis cache read failed:", error);
    }
  }

  // Gather spending data
  const spendingData = await analyzeSpendingPatterns(userId);

  // Generate insights using multiple methods
  const insights: Insight[] = [];

  // 1. Statistical insights (always works, free)
  insights.push(...generateStatisticalInsights(spendingData));

  // 2. AI-enhanced insights (optional, if API key available)
  if (HF_API_KEY) {
    try {
      const aiInsights = await generateAIInsights(spendingData);
      insights.push(...aiInsights);
    } catch (error) {
      console.warn("AI insights unavailable, using statistical only");
    }
  }

  // Sort by priority and return top 5
  const result = insights.sort((a, b) => b.priority - a.priority).slice(0, 5);

  // Cache result (1 hour)
  if (redis) {
    try {
      await redis.setex(cacheKey, 3600, JSON.stringify(result));
    } catch (error) {
      console.warn("Redis cache write failed:", error);
    }
  }

  return result;
};

/**
 * Analyze spending patterns from database
 */
const analyzeSpendingPatterns = async (
  userId: string,
): Promise<SpendingData> => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

  // Get all transactions this month
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      transactionDate: { gte: startOfMonth },
      deletedAt: null,
      amount: { lt: 0 }, // Only expenses
    },
    include: {
      category: true,
    },
  });

  // Calculate totals
  const totalSpent = transactions.reduce(
    (sum, t) => sum + Math.abs(Number(t.amount)),
    0,
  );

  // Category breakdown
  const categoryBreakdown: Record<string, number> = {};
  transactions.forEach((t) => {
    const category = t.category?.name || "Other";
    categoryBreakdown[category] =
      (categoryBreakdown[category] || 0) + Math.abs(Number(t.amount));
  });

  // Week comparison
  const thisWeekTransactions = transactions.filter(
    (t) => t.transactionDate >= startOfWeek,
  );
  const lastWeekTransactions = transactions.filter(
    (t) =>
      t.transactionDate >= startOfLastWeek && t.transactionDate < startOfWeek,
  );

  const thisWeek = thisWeekTransactions.reduce(
    (sum, t) => sum + Math.abs(Number(t.amount)),
    0,
  );
  const lastWeek = lastWeekTransactions.reduce(
    (sum, t) => sum + Math.abs(Number(t.amount)),
    0,
  );

  // Budget status
  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: { category: true },
  });

  const budgetStatus: Record<string, { spent: number; limit: number }> = {};
  budgets.forEach((b) => {
    const category = b.category.name;
    budgetStatus[category] = {
      spent: categoryBreakdown[category] || 0,
      limit: Number(b.amount),
    };
  });

  // Top merchants
  const merchantMap = new Map<string, { amount: number; count: number }>();
  transactions.forEach((t) => {
    if (t.merchant) {
      const existing = merchantMap.get(t.merchant) || { amount: 0, count: 0 };
      merchantMap.set(t.merchant, {
        amount: existing.amount + Math.abs(Number(t.amount)),
        count: existing.count + 1,
      });
    }
  });

  const topMerchants = Array.from(merchantMap.entries())
    .map(([merchant, data]) => ({ merchant, ...data }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return {
    totalSpent,
    categoryBreakdown,
    weekComparison: { thisWeek, lastWeek },
    budgetStatus,
    topMerchants,
  };
};

/**
 * Generate insights using statistical analysis (Always FREE)
 */
const generateStatisticalInsights = (data: SpendingData): Insight[] => {
  const insights: Insight[] = [];

  // 1. Week-over-week comparison
  const weekChange =
    ((data.weekComparison.thisWeek - data.weekComparison.lastWeek) /
      data.weekComparison.lastWeek) *
    100;

  if (weekChange > 40) {
    insights.push({
      id: `week-increase-${Date.now()}`,
      type: "warning",
      title: "Spending Spike Detected",
      message: `You've spent ${weekChange.toFixed(0)}% more this week (₹${data.weekComparison.thisWeek.toFixed(0)} vs ₹${data.weekComparison.lastWeek.toFixed(0)} last week). Consider reviewing recent purchases.`,
      priority: 10,
    });
  } else if (weekChange < -20) {
    insights.push({
      id: `week-decrease-${Date.now()}`,
      type: "positive",
      title: "Great Job on Spending!",
      message: `You've reduced spending by ${Math.abs(weekChange).toFixed(0)}% this week. Keep up the good work! 💰`,
      priority: 8,
    });
  }

  // 2. Budget warnings
  Object.entries(data.budgetStatus).forEach(([category, status]) => {
    const percentage = (status.spent / status.limit) * 100;

    if (percentage > 100) {
      insights.push({
        id: `budget-exceeded-${category}`,
        type: "warning",
        title: `Over Budget: ${category}`,
        message: `You've exceeded your ${category} budget by ₹${(status.spent - status.limit).toFixed(0)} (${percentage.toFixed(0)}% of limit).`,
        actionType: "adjust_budget",
        actionData: { category },
        priority: 9,
      });
    } else if (percentage > 80) {
      const daysLeft = 30 - new Date().getDate();
      insights.push({
        id: `budget-warning-${category}`,
        type: "warning",
        title: `Budget Alert: ${category}`,
        message: `You're at ${percentage.toFixed(0)}% of your ${category} budget with ${daysLeft} days left this month.`,
        priority: 7,
      });
    }
  });

  // 3. Top spending category insight
  const topCategory = Object.entries(data.categoryBreakdown).sort(
    ([, a], [, b]) => b - a,
  )[0];

  if (topCategory) {
    const [category, amount] = topCategory;
    const percentage = (amount / data.totalSpent) * 100;

    insights.push({
      id: `top-category-${Date.now()}`,
      type: "tip",
      title: `${category} is Your Biggest Expense`,
      message: `${percentage.toFixed(0)}% of your spending (₹${amount.toFixed(0)}) goes to ${category}. ${getSavingTip(category, amount)}`,
      actionType: "view_category",
      actionData: { category },
      priority: 6,
    });
  }

  // 4. Frequent merchant insight
  if (data.topMerchants.length > 0) {
    const topMerchant = data.topMerchants[0];
    if (topMerchant && topMerchant.count >= 5) {
      insights.push({
        id: `frequent-merchant-${Date.now()}`,
        type: "tip",
        title: "Frequent Purchases Detected",
        message: `You've made ${topMerchant.count} purchases at ${topMerchant.merchant} totaling ₹${topMerchant.amount.toFixed(0)} this month.`,
        priority: 5,
      });
    }
  }

  return insights;
};

/**
 * Generate AI-enhanced insights using Hugging Face (Optional, FREE)
 */
const generateAIInsights = async (data: SpendingData): Promise<Insight[]> => {
  try {
    // Create a summary for AI
    const summary = `
User spent ₹${data.totalSpent.toFixed(0)} this month.
Top categories: ${Object.entries(data.categoryBreakdown)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([cat, amt]) => `${cat}: ₹${amt.toFixed(0)}`)
        .join(", ")}.
This week: ₹${data.weekComparison.thisWeek.toFixed(0)}, Last week: ₹${data.weekComparison.lastWeek.toFixed(0)}.
    `.trim();

    // Use Hugging Face text generation (FREE)
    const response = await axios.post(
      `${HF_API_URL}gpt2`,
      {
        inputs: `Financial advice for a student: ${summary}. Tip:`,
        parameters: {
          max_length: 100,
          temperature: 0.7,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
        },
        timeout: 10000,
      },
    );

    const aiText = response.data[0]?.generated_text || "";

    if (aiText) {
      return [
        {
          id: `ai-tip-${Date.now()}`,
          type: "tip",
          title: "AI Financial Tip",
          message: aiText
            .replace(`Financial advice for a student: ${summary}. Tip:`, "")
            .trim(),
          priority: 4,
        },
      ];
    }
  } catch (error) {
    console.warn("AI insight generation failed, skipping");
  }

  return [];
};

/**
 * Get category-specific saving tips
 */
const getSavingTip = (category: string, amount: number): string => {
  const tips: Record<string, string> = {
    "Food & Dining": `Cooking at home 2-3 times a week could save you ₹${(amount * 0.3).toFixed(0)}/month.`,
    Transportation: "Consider carpooling or public transport to reduce costs.",
    Shopping:
      "Wait 24 hours before buying non-essentials to avoid impulse purchases.",
    Entertainment:
      "Look for student discounts on streaming services and movies.",
    Groceries:
      "Making a shopping list and buying in bulk can reduce costs by 15-20%.",
  };

  return (
    tips[category] ||
    "Track this category closely to identify savings opportunities."
  );
};

/**
 * Save insights to database
 */
export const saveInsights = async (userId: string, insights: Insight[]) => {
  await prisma.insight.createMany({
    data: insights.map((insight) => ({
      userId,
      insightType: insight.type,
      title: insight.title,
      message: insight.message,
      actionType: insight.actionType,
      actionData: insight.actionData as any,
    })),
  });
};
