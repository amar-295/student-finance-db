import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/database';
import { generateAccessToken } from '../../src/utils/jwt';

describe('Concurrency & Race Condition Tests', () => {
    let authToken: string;
    let userId: string;
    let accountId: string;
    let categoryId: string;

    beforeAll(async () => {
        // cleanup with correct order to avoid FK constraints
        await prisma.paymentReminder.deleteMany();
        await prisma.splitParticipant.deleteMany();
        await prisma.billSplit.deleteMany();
        await prisma.groupMember.deleteMany();
        await prisma.group.deleteMany();
        await prisma.transaction.deleteMany();
        await prisma.account.deleteMany();
        await prisma.user.deleteMany();

        // Create User
        const user = await prisma.user.create({
            data: {
                email: 'race_test@example.com',
                passwordHash: 'hashed_secret',
                name: 'Race Tester',
            },
        });
        userId = user.id;
        authToken = generateAccessToken({ userId: user.id, email: user.email });

        // Create Account with Initial Balance
        const account = await prisma.account.create({
            data: {
                userId,
                name: 'Concurrency Checking',
                accountType: 'checking',
                balance: 1000.00, // Starting balance
            },
        });
        accountId = account.id;

        // Create Category
        const category = await prisma.category.create({
            data: {
                userId,
                name: 'Stress Test',
                type: 'expense',
                isSystem: false,
            },
        });
        categoryId = category.id;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should handle 50 concurrent transactions without lost updates', async () => {
        const CONCURRENT_REQUESTS = 50;
        const TRANSACTION_AMOUNT = 10.00;

        // Prepare 50 identical requests
        const requests = Array.from({ length: CONCURRENT_REQUESTS }).map(() => {
            return request(app)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    accountId,
                    categoryId,
                    amount: TRANSACTION_AMOUNT,
                    merchant: 'Test Merchant',
                    transactionDate: new Date().toISOString(),
                    description: 'Concurrent Transaction',
                });
        });

        // Execute all in parallel
        console.log(`🚀 Launching ${CONCURRENT_REQUESTS} concurrent transactions...`);
        const responses = await Promise.all(requests);

        // Verify all 201 Created
        const successCount = responses.filter(r => r.status === 201).length;
        const failCount = responses.filter(r => r.status !== 201).length;

        if (failCount > 0) {
            console.error('Failed Requests:', responses.filter(r => r.status !== 201).map(r => r.body));
        }

        expect(successCount).toBe(CONCURRENT_REQUESTS);

        // Verify Final Balance
        // Expected: 1000 - (50 * 10) = 500
        const updatedAccount = await prisma.account.findUnique({
            where: { id: accountId },
        });

        const txCount = await prisma.transaction.count({
            where: { accountId },
        });
        console.log(`📊 Transaction Count: ${txCount}`);

        const expectedBalance = 1000.00 - (CONCURRENT_REQUESTS * TRANSACTION_AMOUNT);
        console.log(`💰 Initial: 1000, Deducted: ${CONCURRENT_REQUESTS * TRANSACTION_AMOUNT}, Expected: ${expectedBalance}, Actual: ${updatedAccount?.balance}`);

        // Use closeTo for floating point, though Decimal should be exact
        expect(Number(updatedAccount!.balance)).toBeCloseTo(expectedBalance, 2);
    }, 30000); // 30s timeout
});
