import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import BudgetsPage from '@/pages/BudgetsPage';

describe.skip('Budget Management Flow', () => {
    beforeEach(() => {
        localStorage.setItem('auth-storage', JSON.stringify({
            state: { isAuthenticated: true, accessToken: 'mock-token' },
            version: 0
        }));
    });

    it('creates budget and tracks spending', async () => {
        const user = userEvent.setup();
        render(<BudgetsPage />);

        // Wait for list to load (even if empty)
        await waitFor(() => {
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        // Create budget
        await user.click(screen.getByRole('button', { name: /new budget/i }));

        await user.type(screen.getByLabelText(/budget name/i), 'Coffee Budget');
        await user.type(screen.getByLabelText(/budget amount/i), '50');

        // Select category by value since the label selection was failing
        await user.selectOptions(screen.getByLabelText(/category/i), 'c1');

        await user.click(screen.getByRole('button', { name: /create budget/i }));

        // Verify budget appears
        await waitFor(() => {
            expect(screen.getByText('Coffee Budget')).toBeInTheDocument();
        }, { timeout: 4000 });

        // Verify budget updates (spent value is mocked at 350 for budgetId 1 in handlers.ts)
        await waitFor(() => {
            expect(screen.getByText(/\$350/)).toBeInTheDocument();
        }, { timeout: 4000 });
    });

    it('warns when budget is exceeded', async () => {
        render(<BudgetsPage />);

        await waitFor(() => {
            // Groceries has 350 spent on 300 budget (116.6%)
            const exceededBudget = screen.getByText(/exceeded/i);
            expect(exceededBudget).toBeInTheDocument();
        }, { timeout: 4000 });
    });
});
