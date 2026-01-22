import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import TransactionList from './TransactionList';

const mockTransactions = [
    {
        id: 1,
        description: 'Starbucks',
        amount: -25.50,
        date: '2026-01-20',
        category: 'Food & Dining',
        type: 'EXPENSE' as const,
    },
    {
        id: 2,
        description: 'Salary',
        amount: 2000.00,
        date: '2026-01-15',
        category: 'Income',
        type: 'INCOME' as const,
    },
];

describe('TransactionList', () => {
    it('renders list of transactions', () => {
        render(<TransactionList transactions={mockTransactions} />);

        expect(screen.getByText('Starbucks')).toBeInTheDocument();
        expect(screen.getByText('Salary')).toBeInTheDocument();
    });

    it('displays amounts with correct formatting', () => {
        render(<TransactionList transactions={mockTransactions} />);

        expect(screen.getByText('-$25.50')).toBeInTheDocument();
        expect(screen.getByText('+$2,000.00')).toBeInTheDocument();
    });

    it('applies correct color classes for income and expenses', () => {
        render(<TransactionList transactions={mockTransactions} />);

        const expenseAmount = screen.getByText('-$25.50');
        expect(expenseAmount).toHaveClass('text-red-600');

        const incomeAmount = screen.getByText('+$2,000.00');
        expect(incomeAmount).toHaveClass('text-green-600');
    });

    it('shows empty state when no transactions', () => {
        render(<TransactionList transactions={[]} />);

        expect(screen.getByText(/no transactions/i)).toBeInTheDocument();
    });

    it('calls onDelete when delete button is clicked', async () => {
        const user = userEvent.setup();
        const mockOnDelete = vi.fn();

        render(
            <TransactionList
                transactions={mockTransactions}
                onDelete={mockOnDelete}
            />
        );

        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        await user.click(deleteButtons[0]);

        expect(mockOnDelete).toHaveBeenCalledWith(1);
    });

    it('filters transactions by search term', async () => {
        const user = userEvent.setup();
        render(<TransactionList transactions={mockTransactions} />);

        const searchInput = screen.getByPlaceholderText(/search/i);
        await user.type(searchInput, 'Starbucks');

        expect(screen.getByText('Starbucks')).toBeInTheDocument();
        expect(screen.queryByText('Salary')).not.toBeInTheDocument();
    });

    it('sorts transactions by date', async () => {
        const user = userEvent.setup();
        render(<TransactionList transactions={mockTransactions} />);

        const sortButton = screen.getByRole('button', { name: /sort by date/i });
        await user.click(sortButton);

        const rows = screen.getAllByRole('row');
        // rows[0] is header, rows[1] is first data row
        // Initially sorted by desc (Salary, then Starbucks) -> Click toggle -> Sort by asc (Salary, then Starbucks) 
        // Wait, mockTransactions: Starbucks (20th), Salary (15th).
        // Default desc: Starbucks (20th) is first.
        // Click toggle (asc): Salary (15th) is first.

        const firstRowAfterToggle = within(rows[1]).getByText('Salary');
        expect(firstRowAfterToggle).toBeInTheDocument();

        await user.click(sortButton); // back to desc
        const rowsAfterSecondToggle = screen.getAllByRole('row');
        const firstRowAfterSecondToggle = within(rowsAfterSecondToggle[1]).getByText('Starbucks');
        expect(firstRowAfterSecondToggle).toBeInTheDocument();
    });
});
