import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/database';

describe('Scenario 2: Budget Tracking Over Time', () => {
    let token: string;
    let checkingAccountId: string;
    let foodCategoryId: string;
    let budgetId: string;

    const user = {
        email: 'scenario2_user@example.com',
        password: 'Password123!',
        name: 'Scenario User',
    };

    beforeAll(async () => {
        // Cleanup
        await prisma.transaction.deleteMany();
        await prisma.budget.deleteMany();
        await prisma.account.deleteMany();
        await prisma.user.deleteMany();

        // 1. Register & Login
        const authRes = await request(app).post('/api/auth/register').send(user);
        token = authRes.body.data.tokens.accessToken;

        // 2. Create Checking Account
        const accRes = await request(app)
            .post('/api/accounts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Main Checking',
                accountType: 'checking',
                balance: 1000,
                currency: 'USD'
            });
        checkingAccountId = accRes.body.data.id;

        // 3. Get Food Category (System or Create)
        // Check system categories first
        const catRes = await request(app)
            .get('/api/categories')
            .set('Authorization', `Bearer ${token}`);

        const foodCat = catRes.body.data.find((c: any) => c.name.toLowerCase().includes('food'));
        if (foodCat) {
            foodCategoryId = foodCat.id;
        } else {
            // Create if missing
            const newCat = await request(app)
                .post('/api/categories')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Food', type: 'expense', icon: 'food' });
            foodCategoryId = newCat.body.data.id;
        }
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('Step 1: Create $100 food budget', async () => {
        const res = await request(app)
            .post('/api/budgets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                categoryId: foodCategoryId,
                amount: 100.00,
                period: 'monthly',
                alertThreshold: 80
            });

        expect(res.status).toBe(201);
        budgetId = res.body.data.id;
    });

    it('Step 2: Check initial status (0% spent)', async () => {
        const res = await request(app)
            .get('/api/budgets/status')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        const budgetStatus = res.body.data.find((b: any) => b.budgetId === budgetId);
        expect(budgetStatus).toBeDefined();
        expect(budgetStatus.percentage).toBe(0);
        expect(budgetStatus.status).toBe('safe');
    });

    it('Step 3: Add transaction ($30 - 30%)', async () => {
        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send({
                accountId: checkingAccountId,
                categoryId: foodCategoryId,
                amount: 30.00, // API handles negation for expenses automatically or expects positive if logic requires? 
                // Wait, logic says "amount: { lt: 0 }" for expenses. 
                // But createTransaction might auto-negate based on category type.
                // Re-checking service... createTransaction checks category.type.
                // "if (category?.type === 'expense') finalAmount = -Math.abs(input.amount)"
                // So sending positive 30 is fine, it becomes -30.
                merchant: 'Lunch'
            });

        const res = await request(app)
            .get('/api/budgets/status')
            .set('Authorization', `Bearer ${token}`);

        const budgetStatus = res.body.data.find((b: any) => b.budgetId === budgetId);
        expect(budgetStatus.percentage).toBe(30);
        expect(budgetStatus.status).toBe('safe');
    });

    it('Step 4: Add more ($40 - 70% total)', async () => {
        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send({
                accountId: checkingAccountId,
                categoryId: foodCategoryId,
                amount: 40.00,
                merchant: 'Dinner'
            });

        const res = await request(app)
            .get('/api/budgets/status')
            .set('Authorization', `Bearer ${token}`);

        const budgetStatus = res.body.data.find((b: any) => b.budgetId === budgetId);
        expect(budgetStatus.percentage).toBe(70);
        expect(budgetStatus.status).toBe('warning');
        // 70 >= (80-20=60) is warning
    });

    it('Step 5: Add more ($15 - 85% total, over threshold)', async () => {
        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send({
                accountId: checkingAccountId,
                categoryId: foodCategoryId,
                amount: 15.00,
                merchant: 'Coffee'
            });

        const res = await request(app)
            .get('/api/budgets/status')
            .set('Authorization', `Bearer ${token}`);

        const budgetStatus = res.body.data.find((b: any) => b.budgetId === budgetId);
        expect(budgetStatus.percentage).toBe(85);
        expect(budgetStatus.status).toBe('danger');
        // 85 >= 80 is danger
    });

    it('Step 6: Check alerts', async () => {
        const res = await request(app)
            .get('/api/budgets/alerts')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        // Expect a budget_warning alert
        const warning = res.body.data.find((a: any) => a.budgetId === budgetId && a.type === 'budget_warning');
        expect(warning).toBeDefined();
        expect(warning.severity).toBe('medium');
    });
    it('Step 6: Exceed budget ($20 - 105% total)', async () => {
        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send({
                accountId: checkingAccountId,
                categoryId: foodCategoryId,
                amount: 20.00,
                merchant: 'Late night snack'
            });

        const res = await request(app)
            .get('/api/budgets/status')
            .set('Authorization', `Bearer ${token}`);

        const budgetStatus = res.body.data.find((b: any) => b.budgetId === budgetId);
        expect(budgetStatus.percentage).toBe(105);
        expect(budgetStatus.status).toBe('exceeded');

        // Check alerts
        const alertRes = await request(app)
            .get('/api/budgets/alerts')
            .set('Authorization', `Bearer ${token}`);

        const exceededAlert = alertRes.body.data.find((a: any) => a.budgetId === budgetId && a.type === 'budget_exceeded');
        expect(exceededAlert).toBeDefined();
        expect(exceededAlert.severity).toBe('high');
    });
});
