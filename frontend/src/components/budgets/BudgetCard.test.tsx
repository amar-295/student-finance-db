import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import BudgetCard from './BudgetCard';

const mockBudget = {
    id: 1,
    name: 'Groceries',
    category: 'Food & Dining',
    amount: 300,
    spent: 180,
    period: 'MONTHLY',
    percentUsed: 60,
    isExceeded: false,
};

describe('BudgetCard', () => {
    it('renders budget information', () => {
        render(<BudgetCard budget={mockBudget} />);

        expect(screen.getByText('Groceries')).toBeInTheDocument();
        expect(screen.getByText('Food & Dining')).toBeInTheDocument();
        expect(screen.getByText(/\$180\.00/)).toBeInTheDocument();
        expect(screen.getByText(/\/ \$300\.00/)).toBeInTheDocument();
    });

    it('shows correct progress bar percentage', () => {
        render(<BudgetCard budget={mockBudget} />);

        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow', '60');
    });

    it('displays green progress for under 70%', () => {
        render(<BudgetCard budget={mockBudget} />);

        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveClass('bg-green-500');
    });

    it('displays yellow progress for 70-90%', () => {
        const budget = { ...mockBudget, spent: 240, percentUsed: 80 };
        render(<BudgetCard budget={budget} />);

        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveClass('bg-yellow-500');
    });

    it('displays red progress for over 90%', () => {
        const budget = { ...mockBudget, spent: 280, percentUsed: 93, isExceeded: false };
        render(<BudgetCard budget={budget} />);

        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveClass('bg-red-500');
    });

    it('shows exceeded badge when budget is exceeded', () => {
        const budget = { ...mockBudget, spent: 350, percentUsed: 116, isExceeded: true };
        render(<BudgetCard budget={budget} />);

        expect(screen.getByText(/exceeded/i)).toBeInTheDocument();
    });

    it('calculates and displays remaining amount', () => {
        render(<BudgetCard budget={mockBudget} />);
        // screen.debug();

        expect(screen.getByText(/\$120\.00/)).toBeInTheDocument(); // 300 - 180
        expect(screen.getByText(/remaining/i)).toBeInTheDocument();
    });
});
