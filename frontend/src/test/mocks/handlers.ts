import { http, HttpResponse } from 'msw';

// In-memory state for transactions to support CRUD integration tests
let transactions = [
    {
        id: '1',
        amount: -25.50,
        description: 'Starbucks',
        merchant: 'Starbucks',
        transactionDate: '2026-01-20T10:00:00Z',
        category: { id: 'c1', name: 'Food & Dining', color: '#EF4444', icon: 'restaurant' },
        status: 'cleared'
    }
];

export const handlers = [
    // Categories
    http.get('*/api/categories', () => {
        return HttpResponse.json([
            { id: 'c1', name: 'Food & Dining', color: '#EF4444', icon: 'restaurant' },
            { id: 'c2', name: 'Transport', color: '#3B82F6', icon: 'directions_bus' },
            { id: 'c3', name: 'Entertainment', color: '#8B5CF6', icon: 'movie' },
        ]);
    }),

    // Accounts
    http.get('*/api/accounts', () => {
        return HttpResponse.json([
            { id: '1', name: 'Checking', type: 'CHECKING', balance: 1500, accountNumber: '1234' },
            { id: '2', name: 'Savings', type: 'SAVINGS', balance: 5000, accountNumber: '5678' },
        ]);
    }),

    // Authentication
    http.post('*/api/auth/login', async ({ request }) => {
        const { email, password } = (await request.json()) as any;

        if (email === 'alex@demo.com' && password === 'DemoPassword123') {
            return HttpResponse.json({
                data: {
                    user: { id: '1', email, name: 'Alex', firstName: 'Alex' },
                    accessToken: 'mock-token',
                    refreshToken: 'mock-refresh-token',
                }
            });
        }

        return HttpResponse.json(
            { message: 'Invalid credentials' },
            { status: 401 }
        );
    }),

    // Transactions
    http.get('*/api/transactions', () => {
        return HttpResponse.json({
            data: transactions,
            pagination: { total: transactions.length, page: 1, limit: 20, totalPages: 1, hasMore: false }
        });
    }),

    http.post('*/api/transactions', async ({ request }) => {
        const data = (await request.json()) as any;
        const newTxn = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            merchant: data.description, // Mocking merchant as description for simplicity
            transactionDate: data.date || new Date().toISOString(),
            amount: Number(data.amount) || 0
        };
        transactions = [newTxn, ...transactions];
        return HttpResponse.json(newTxn);
    }),

    http.put('*/api/transactions/:id', async ({ params, request }) => {
        const data = (await request.json()) as any;
        const { id } = params;
        transactions = transactions.map(t => t.id === id ? { ...t, ...data, merchant: data.description || t.merchant, transactionDate: data.date || t.transactionDate } : t);
        const updated = transactions.find(t => t.id === id);
        return HttpResponse.json(updated);
    }),

    http.delete('*/api/transactions/:id', ({ params }) => {
        const { id } = params;
        transactions = transactions.filter(t => t.id !== id);
        return new HttpResponse(null, { status: 204 });
    }),

    // Budgets
    http.get('*/api/budgets', () => {
        return HttpResponse.json([
            {
                id: '1',
                name: 'Groceries',
                amount: 300,
                periodType: 'monthly',
                category: { id: 'c1', name: 'Food & Dining', color: '#EF4444', icon: 'restaurant' }
            }
        ]);
    }),

    http.get('*/api/budgets/status', () => {
        return HttpResponse.json([
            {
                budgetId: '1',
                spent: 350,
                remaining: -50,
                percentage: 116.6,
                status: 'exceeded',
                daysLeft: 10
            }
        ]);
    }),

    http.get('*/api/budgets/recommend', () => {
        return HttpResponse.json([
            { category: 'Food & Dining', recommendedBudget: 400, reason: 'Based on your coffee spending' }
        ]);
    }),

    http.post('*/api/budgets', async ({ request }) => {
        const data = (await request.json()) as any;
        return HttpResponse.json({
            id: Math.random().toString(36).substr(2, 9),
            ...data
        });
    }),
];
