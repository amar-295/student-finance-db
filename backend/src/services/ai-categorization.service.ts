import axios from 'axios';
import { getRedisClient } from '../config/redis';

/**
 * Hugging Face AI Service (100% FREE)
 * 
 * Uses Hugging Face Inference API for transaction categorization
 * No credit card required, 30,000 requests/month free
 * 
 * Setup:
 * 1. Go to https://huggingface.co/
 * 2. Sign up (free, no payment info needed)
 * 3. Go to Settings → Access Tokens
 * 4. Create a new token
 * 5. Add to .env: HUGGING_FACE_API_KEY=hf_...
 */

const HF_API_URL = 'https://api-inference.huggingface.co/models/';
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;
const CACHE_PREFIX = 'ai:category:';
const CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds

// Fallback in-memory cache (used when Redis is not available)
const fallbackCache = new Map<string, AICategorizationResult>();

// Available categories for classification
const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Education',
  'Healthcare',
  'Utilities',
  'Rent',
  'Groceries',
  'Other',
];

interface AICategorizationResult {
  category: string;
  confidence: number;
  aiGenerated: boolean;
}

/**
 * Get cached category from Redis or fallback
 */
const getCachedCategory = async (key: string): Promise<AICategorizationResult | null> => {
  const redis = getRedisClient();

  if (redis) {
    try {
      const cached = await redis.get(`${CACHE_PREFIX}${key}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Redis cache get error:', error);
    }
  }

  // Fallback to in-memory cache
  return fallbackCache.get(key) || null;
};

/**
 * Set cached category in Redis or fallback
 */
const setCachedCategory = async (key: string, result: AICategorizationResult): Promise<void> => {
  const redis = getRedisClient();

  if (redis) {
    try {
      await redis.setex(`${CACHE_PREFIX}${key}`, CACHE_TTL, JSON.stringify(result));
      return;
    } catch (error) {
      console.error('Redis cache set error:', error);
    }
  }

  // Fallback to in-memory cache
  fallbackCache.set(key, result);
};

/**
 * Categorize transaction using Hugging Face AI
 */
export const categorizeWithAI = async (
  merchant: string,
  amount?: number
): Promise<AICategorizationResult> => {
  try {
    // If no API key, fall back to rule-based
    if (!HF_API_KEY) {
      console.warn('⚠️ No Hugging Face API key found. Using rule-based categorization.');
      return categorizeWithRules(merchant, amount);
    }

    // Use zero-shot classification model (FREE)
    const response = await axios.post(
      `${HF_API_URL}facebook/bart-large-mnli`,
      {
        inputs: merchant,
        parameters: {
          candidate_labels: CATEGORIES,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
        },
        timeout: 10000, // 10 second timeout
      }
    );

    // Extract result
    const result = response.data;
    const category = result.labels[0];
    const confidence = result.scores[0];

    return {
      category,
      confidence,
      aiGenerated: true,
    };
  } catch (error: any) {
    console.error('AI categorization failed:', error.message);

    // Fallback to rule-based if AI fails
    return categorizeWithRules(merchant, amount);
  }
};

/**
 * Rule-based categorization (Fallback - Always Works)
 */
const categorizeWithRules = (
  merchant: string,
  amount?: number
): AICategorizationResult => {
  const normalized = merchant.toLowerCase().trim();

  // Food & Dining patterns
  if (/starbucks|ccd|cafe|coffee|restaurant|zomato|swiggy|dominos|mcdonald|kfc|burger/i.test(normalized)) {
    return { category: 'Food & Dining', confidence: 0.9, aiGenerated: false };
  }

  // Transportation patterns
  if (/uber|ola|rapido|metro|petrol|diesel|fuel|parking|toll/i.test(normalized)) {
    return { category: 'Transportation', confidence: 0.9, aiGenerated: false };
  }

  // Shopping patterns
  if (/amazon|flipkart|myntra|ajio|shopping|mall|store/i.test(normalized)) {
    return { category: 'Shopping', confidence: 0.85, aiGenerated: false };
  }

  // Entertainment patterns
  if (/netflix|prime|hotstar|spotify|movie|pvr|inox|cinema|game/i.test(normalized)) {
    return { category: 'Entertainment', confidence: 0.85, aiGenerated: false };
  }

  // Education patterns
  if (/udemy|coursera|college|university|tuition|book|course/i.test(normalized)) {
    return { category: 'Education', confidence: 0.9, aiGenerated: false };
  }

  // Healthcare patterns
  if (/hospital|clinic|doctor|pharmacy|medicine|health/i.test(normalized)) {
    return { category: 'Healthcare', confidence: 0.9, aiGenerated: false };
  }

  // Utilities patterns
  if (/electricity|water|gas|internet|wifi|broadband|mobile|phone/i.test(normalized)) {
    return { category: 'Utilities', confidence: 0.9, aiGenerated: false };
  }

  // Groceries patterns
  if (/grocery|supermarket|reliance|dmart|bigbazaar|vegetables|fruits/i.test(normalized)) {
    return { category: 'Groceries', confidence: 0.85, aiGenerated: false };
  }

  // Rent patterns (usually large amounts)
  if (/rent|lease|housing/i.test(normalized) || (amount && amount > 5000)) {
    return { category: 'Rent', confidence: amount ? 0.8 : 0.7, aiGenerated: false };
  }

  // Default
  return { category: 'Other', confidence: 0.5, aiGenerated: false };
};

/**
 * Smart categorization with Redis caching
 * Uses cache first, then AI, then rules
 */
export const categorizeTransaction = async (
  merchant: string,
  amount?: number
): Promise<AICategorizationResult> => {
  const cacheKey = merchant.toLowerCase().trim();

  // Check cache first (instant, free)
  const cached = await getCachedCategory(cacheKey);
  if (cached) {
    return { ...cached, confidence: 1.0 }; // Full confidence for cached results
  }

  // Try AI categorization
  const result = await categorizeWithAI(merchant, amount);

  // Cache successful results with high confidence
  if (result.confidence > 0.7) {
    await setCachedCategory(cacheKey, result);
  }

  return result;
};

/**
 * Batch categorization (more efficient for multiple transactions)
 */
export const categorizeBatch = async (
  merchants: string[]
): Promise<AICategorizationResult[]> => {
  const results = await Promise.all(
    merchants.map((merchant) => categorizeTransaction(merchant))
  );
  return results;
};

/**
 * Get categorization statistics
 */
export const getCategorizationStats = async () => {
  const redis = getRedisClient();

  if (redis) {
    try {
      const keys = await redis.keys(`${CACHE_PREFIX}*`);
      return {
        cacheType: 'redis',
        cacheSize: keys.length,
        cachedMerchants: keys.map((k: string) => k.replace(CACHE_PREFIX, '')),
      };
    } catch (error) {
      console.error('Failed to get Redis stats:', error);
    }
  }

  return {
    cacheType: 'in-memory',
    cacheSize: fallbackCache.size,
    cachedMerchants: Array.from(fallbackCache.keys()),
  };
};

/**
 * Clear cache (for testing or maintenance)
 */
export const clearCategorizationCache = async () => {
  const redis = getRedisClient();

  if (redis) {
    try {
      const keys = await redis.keys(`${CACHE_PREFIX}*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return;
    } catch (error) {
      console.error('Failed to clear Redis cache:', error);
    }
  }

  fallbackCache.clear();
};
