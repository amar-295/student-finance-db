import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import TransactionsPage from '@/pages/TransactionsPage';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { toast } from 'sonner';

// Mock simple toast for assertions
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
    action: vi.fn(),
    Toaster: () => null,
}));

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

describe('AI Categorization Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    afterEach(() => {
        server.resetHandlers();
    });

    it('automatically categorizes known merchants', async () => {
        const user = userEvent.setup();

        // 1. Initial State: Empty
        let transactions: any[] = [];

        server.use(
            http.get('*/api/transactions', () => {
                return HttpResponse.json({
                    data: transactions,
                    pagination: { page: 1, limit: 20, total: transactions.length, totalPages: 1, hasMore: false }
                });
            }),
            http.post('*/api/transactions', async ({ request }) => {
                const body = await request.json() as any;

                // Simulate Backend AI Logic
                let aiCategorized = false;
                let category = body.category ? { name: body.category, color: '#000', icon: 'misc' } : undefined;

                if (!body.category && body.description?.toLowerCase().includes('starbucks')) {
                    aiCategorized = true;
                    category = { name: 'Food & Dining', color: '#EF4444', icon: 'restaurant' };
                }

                const newTxn = {
                    id: 'new-1',
                    ...body,
                    date: body.date, // already string
                    amount: body.amount,
                    type: body.type,
                    accountId: body.accountId,
                    aiCategorized,
                    category,
                    transactionDate: body.date // Service returns this
                };
                transactions = [newTxn];
                return HttpResponse.json(newTxn);
            })
        );

        render(<TransactionsPage />);

        // 2. Open Add Transaction Modal
        const addBtn = await screen.findByRole('button', { name: /Add Transaction/i });
        await user.click(addBtn);

        const dialog = await screen.findByRole('dialog');

        // 3. Fill Form: "Starbucks" without category
        // Description
        await user.type(within(dialog).getByLabelText(/Description/i), 'Starbucks Coffee');
        // Amount
        await user.type(within(dialog).getByLabelText(/Amount/i), '5.50');
        // Date
        await user.type(within(dialog).getByLabelText(/Date/i), '2023-10-25');
        // Account (Select first option if needed, usually default is selected)
        // Ensure account is selected? Code defaults to first account.

        // 4. Submit
        await user.click(within(dialog).getByRole('button', { name: /Save Transaction/i }));

        // 5. Verify Toast
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Transaction created');
        });

        // 6. Verify List Update
        expect(await screen.findByText('Starbucks Coffee')).toBeInTheDocument();

        // 7. Verify AI Badge and Category
        // "AI" badge text
        const aiBadge = await screen.findByText(/^AI$/); // Exact match for badge "AI"
        expect(aiBadge).toBeVisible();
        expect(aiBadge).toHaveAttribute('title', 'AI Categorized');

        // Verify Auto-assigned Category
        expect(screen.getByText('Food & Dining')).toBeVisible();
    });

    it('respects manual categorization over AI', async () => {
        const user = userEvent.setup();
        let transactions: any[] = [];

        server.use(
            http.get('*/api/transactions', () => {
                return HttpResponse.json({
                    data: transactions,
                    pagination: { page: 1, limit: 20, total: transactions.length, totalPages: 1, hasMore: false }
                });
            }),
            http.post('*/api/transactions', async ({ request }) => {
                const body = await request.json() as any;

                // Simulate Backend Logic: Manual overrides AI
                let aiCategorized = false;
                let category = body.category ? { name: body.category, color: '#000', icon: 'misc' } : undefined;

                if (!body.category && body.description?.toLowerCase().includes('uber')) {
                    // AI logic would go here
                    aiCategorized = true;
                    category = { name: 'Transport', color: 'blue', icon: 'car' };
                }

                // If user provided category, it's NOT AI categorized (or at least user confirmed it)
                if (body.category) {
                    aiCategorized = false; // User override
                    category = { name: body.category, color: '#000', icon: 'misc' };
                }

                const newTxn = {
                    id: 'new-2',
                    ...body,
                    transactionDate: body.date,
                    aiCategorized,
                    category
                };
                transactions = [newTxn];
                return HttpResponse.json(newTxn);
            })
        );

        render(<TransactionsPage />);

        // Open Modal
        await user.click(await screen.findByRole('button', { name: /Add Transaction/i }));
        const dialog = await screen.findByRole('dialog');

        // Fill Form: "Uber" BUT manually set "Business"
        await user.type(within(dialog).getByLabelText(/Description/i), 'Uber to Client');
        await user.type(within(dialog).getByLabelText(/Amount/i), '25.00');
        await user.type(within(dialog).getByLabelText(/Date/i), '2023-10-26');

        // Manually type category
        await user.type(within(dialog).getByLabelText(/Category/i), 'Business');

        // Submit
        await user.click(within(dialog).getByRole('button', { name: /Save Transaction/i }));

        // Verify List
        expect(await screen.findByText('Uber to Client')).toBeInTheDocument();

        // Verify Manual Category displayed
        expect(screen.getByText('Business')).toBeVisible();

        // Verify NO AI Badge
        const aiBadge = screen.queryByText(/^AI$/);
        expect(aiBadge).not.toBeInTheDocument();
    });
});
