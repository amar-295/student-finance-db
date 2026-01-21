import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/database';

// Mock the PrismaClient response
jest.mock('../../src/config/database', () => ({
    __esModule: true,
    default: {
        $queryRaw: jest.fn(),
    },
}));

describe('Resilience Verification - Database Down (Test 27.2)', () => {
    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('should return 503 Service Unavailable when database is unreachable', async () => {
        // 1. Setup Mock Failure
        (prisma.$queryRaw as jest.Mock).mockRejectedValueOnce(new Error('Connection refused'));

        // 2. Execute Health Check
        console.log('🧪 Testing: GET /health/detailed with simulated DB failure...');
        const response = await request(app).get('/health/detailed');

        // 3. Verify Response
        expect(response.status).toBe(503);
        expect(response.body.success).toBe(false);
        expect(response.body.data.database).toBe('error');

        console.log('✅ PASS: System correctly reported 503 and database error status.');
    });

    it('should return 200 OK when database recovers', async () => {
        // 1. Setup Mock Success
        (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([{ 1: 1 }]);

        // 2. Execute Health Check
        console.log('🧪 Testing: GET /health/detailed with database recovery...');
        const response = await request(app).get('/health/detailed');

        // 3. Verify Response
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.database).toBe('ok');

        console.log('✅ PASS: System correctly reported 200 after recovery.');
    });
});
