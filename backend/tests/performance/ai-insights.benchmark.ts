import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock dependencies
jest.mock('../../src/config/database', () => ({
  __esModule: true,
  default: {
      transaction: { findMany: jest.fn() },
      budget: { findMany: jest.fn() },
      insight: { createMany: jest.fn() },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
  },
}));

jest.mock('axios');

jest.mock('../../src/config/redis', () => ({
    __esModule: true,
    getRedisClient: jest.fn(),
    isRedisAvailable: jest.fn().mockResolvedValue(false as never),
    disconnectRedis: jest.fn(),
    default: jest.fn(),
}));

// We don't import them at top level to avoid stale references after resetModules

describe('Performance: generateInsights', () => {
    beforeEach(() => {
        jest.resetModules();
        process.env.HUGGING_FACE_API_KEY = 'test-key';
        jest.clearAllMocks();
    });

    it('measures execution time without caching', async () => {
        const { generateInsights } = require('../../src/services/ai-insights.service');
        const prisma = require('../../src/config/database').default;
        const axios = require('axios');
        const redisConf = require('../../src/config/redis');

        // Setup Redis mock to return null (no cache)
        (redisConf.getRedisClient as jest.Mock).mockReturnValue(null);

        // Setup Prisma mocks with delays
        (prisma.transaction.findMany as jest.Mock).mockImplementation(async () => {
            await new Promise(r => setTimeout(r, 50)); // DB delay
            return [];
        });
        (prisma.budget.findMany as jest.Mock).mockImplementation(async () => {
             await new Promise(r => setTimeout(r, 20)); // DB delay
             return [];
        });

        // Mock axios to simulate AI API call delay
        (axios.post as jest.Mock).mockImplementation(async () => {
             await new Promise(r => setTimeout(r, 200)); // AI API delay
             return { data: [{ generated_text: "AI Tip" }] };
        });

        const start = Date.now();
        await generateInsights('user-123');
        const end = Date.now();
        const duration = end - start;

        console.log(`Baseline Execution Time: ${duration}ms`);

        // Expectation: at least 270ms (50+20+200)
        expect(duration).toBeGreaterThanOrEqual(270);
    });

    it('measures execution time with caching (cache hit)', async () => {
        const { generateInsights } = require('../../src/services/ai-insights.service');
        const redisConf = require('../../src/config/redis');
        const prisma = require('../../src/config/database').default;
        const axios = require('axios');

        const mockInsights = [{
            id: '1', type: 'tip', title: 'Cached Tip', message: 'Cached', priority: 1
        }];

        const mockRedis = {
            get: jest.fn().mockImplementation(async () => JSON.stringify(mockInsights)),
            setex: jest.fn().mockImplementation(async () => 'OK'),
        };

        (redisConf.getRedisClient as jest.Mock).mockReturnValue(mockRedis);

        const start = Date.now();
        const result = await generateInsights('user-123');
        const end = Date.now();
        const duration = end - start;

        console.log(`Cached Execution Time: ${duration}ms`);

        expect(result).toEqual(mockInsights);
        expect(duration).toBeLessThan(50);

        // Ensure expensive operations were skipped
        expect(prisma.transaction.findMany).not.toHaveBeenCalled();
        expect(prisma.budget.findMany).not.toHaveBeenCalled();
        expect(axios.post).not.toHaveBeenCalled();
    });
});
