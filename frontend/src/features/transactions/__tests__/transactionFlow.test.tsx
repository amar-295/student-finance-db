import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import TransactionsPage from '@/pages/TransactionsPage';

describe('Transaction CRUD Flow', () => {
    beforeEach(() => {
        localStorage.setItem('auth-storage', JSON.stringify({
            state: { isAuthenticated: true, accessToken: 'mock-token' },
            version: 0
        }));
        // Mock confirm for deletion
        window.confirm = vi.fn().mockReturnValue(true);
    });

    it('creates, edits, and deletes a transaction', async () => {
        const user = userEvent.setup();
        render(<TransactionsPage />);

        // Wait for page to load
        await waitFor(() => {
            expect(screen.getByText(/transactions/i)).toBeInTheDocument();
        });

        // CREATE: Open create modal
        await user.click(screen.getByRole('button', { name: /add transaction/i }));

        // Fill form
        await user.type(screen.getByLabelText(/description/i), 'Test Transaction');
        await user.type(screen.getByLabelText(/amount/i), '100');
        // Using simple text input or select as per the TransactionForm.tsx
        // Since it's a datalist, we can just type.
        await user.type(screen.getByLabelText(/category/i), 'Food');

        await user.click(screen.getByRole('button', { name: /save/i }));

        // Verify creation
        await waitFor(() => {
            expect(screen.getByText('Test Transaction')).toBeInTheDocument();
        }, { timeout: 4000 });

        // EDIT: Click edit button
        const transactionRow = screen.getByText('Test Transaction').closest('tr')!;
        const editButton = within(transactionRow).getByLabelText(/edit/i);
        await user.click(editButton);

        // Modify description
        const descInput = screen.getByLabelText(/description/i);
        await user.clear(descInput);
        await user.type(descInput, 'Updated Transaction');
        await user.click(screen.getByRole('button', { name: /save/i }));

        // Verify update
        await waitFor(() => {
            expect(screen.getByText('Updated Transaction')).toBeInTheDocument();
        }, { timeout: 4000 });

        // DELETE: Click delete button
        const updatedRow = screen.getByText('Updated Transaction').closest('tr')!;
        const deleteButton = within(updatedRow).getByLabelText(/delete/i);
        await user.click(deleteButton);

        // Verify deletion
        await waitFor(() => {
            expect(screen.queryByText('Updated Transaction')).not.toBeInTheDocument();
        }, { timeout: 4000 });
    });

    it('filters and searches transactions', async () => {
        const user = userEvent.setup();
        render(<TransactionsPage />);

        await waitFor(() => {
            expect(screen.getByText(/transactions/i)).toBeInTheDocument();
        });

        // Search
        const searchInput = screen.getByPlaceholderText(/search/i);
        await user.type(searchInput, 'Starbucks');

        // The mock handler returns "Starbucks" twice (name and desc)
        await waitFor(() => {
            const starbucksElements = screen.getAllByText('Starbucks');
            expect(starbucksElements.length).toBeGreaterThanOrEqual(1);
        }, { timeout: 4000 });
    });
});
