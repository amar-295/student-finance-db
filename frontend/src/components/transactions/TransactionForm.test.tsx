import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import TransactionForm from './TransactionForm';

describe('TransactionForm', () => {
    const mockOnSubmit = vi.fn();
    const mockAccounts = [
        { id: 1, name: 'Checking', type: 'CHECKING' },
        { id: 2, name: 'Savings', type: 'SAVINGS' },
    ];

    beforeEach(() => {
        mockOnSubmit.mockClear();
    });

    it('renders all form fields', () => {
        render(<TransactionForm onSubmit={mockOnSubmit} accounts={mockAccounts} />);

        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/account/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        const user = userEvent.setup();
        render(<TransactionForm onSubmit={mockOnSubmit} accounts={mockAccounts} />);

        // Using a more flexible button matcher since my component has "Save Transaction"
        await user.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => {
            expect(screen.getByText(/description is required/i)).toBeInTheDocument();
            expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
        });
    });

    it('validates amount is greater than zero', async () => {
        const user = userEvent.setup();
        render(<TransactionForm onSubmit={mockOnSubmit} accounts={mockAccounts} />);

        const amountInput = screen.getByLabelText(/amount/i);
        await user.clear(amountInput);
        await user.type(amountInput, '0');
        await user.tab();

        await waitFor(() => {
            expect(screen.getByText(/must be greater than 0/i)).toBeInTheDocument();
        });
    });

    it('submits form with valid data', async () => {
        const user = userEvent.setup();
        render(<TransactionForm onSubmit={mockOnSubmit} accounts={mockAccounts} />);

        await user.type(screen.getByLabelText(/description/i), 'Grocery shopping');
        await user.clear(screen.getByLabelText(/amount/i));
        await user.type(screen.getByLabelText(/amount/i), '45.50');
        await user.type(screen.getByLabelText(/date/i), '2026-01-22');
        await user.selectOptions(screen.getByLabelText(/account/i), '1');
        await user.type(screen.getByLabelText(/category/i), 'Food'); // Added category since it's required in schema
        await user.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                description: 'Grocery shopping',
                amount: 45.50,
                date: '2026-01-22',
                accountId: 1,
                category: 'Food',
                type: 'EXPENSE',
            });
        });
    });

    it('defaults to expense type', () => {
        render(<TransactionForm onSubmit={mockOnSubmit} accounts={mockAccounts} />);

        const expenseRadio = screen.getByLabelText(/expense/i) as HTMLInputElement;
        expect(expenseRadio.checked).toBe(true);
    });

    it('switches between income and expense', async () => {
        const user = userEvent.setup();
        render(<TransactionForm onSubmit={mockOnSubmit} accounts={mockAccounts} />);

        const incomeRadio = screen.getByLabelText(/income/i);
        await user.click(incomeRadio);

        expect(incomeRadio).toBeChecked();
    });

    it('populates form when editing existing transaction', () => {
        const transaction = {
            description: 'Coffee',
            amount: 5.50,
            date: '2026-01-20',
            accountId: 1,
            category: 'Food',
            type: 'EXPENSE' as const,
        };

        render(
            <TransactionForm
                onSubmit={mockOnSubmit}
                accounts={mockAccounts}
                initialData={transaction}
            />
        );

        expect(screen.getByLabelText(/description/i)).toHaveValue('Coffee');
        expect(screen.getByLabelText(/amount/i)).toHaveValue(5.50);
    });
});
