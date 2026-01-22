import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        mockOnSubmit.mockClear();
    });

    it('renders login form with email and password fields', () => {
        render(<LoginForm onSubmit={mockOnSubmit} />);

        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    it('validates email format', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/email address/i);
        await user.type(emailInput, 'invalid-email');
        await user.tab(); // Trigger blur

        await waitFor(() => {
            expect(screen.getByText(/valid email/i)).toBeInTheDocument();
        });
    });

    it('requires password to be at least 8 characters', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={mockOnSubmit} />);

        const passwordInput = screen.getByLabelText(/^password$/i);
        await user.type(passwordInput, 'short');
        await user.tab();

        await waitFor(() => {
            expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
        });
    });

    it('submits form with valid credentials', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={mockOnSubmit} />);

        await user.type(screen.getByLabelText(/email address/i), 'alex@demo.com');
        await user.type(screen.getByLabelText(/^password$/i), 'DemoPassword123');
        await user.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                email: 'alex@demo.com',
                password: 'DemoPassword123',
            });
        });
    });

    it('disables submit button while loading', async () => {
        render(<LoginForm onSubmit={mockOnSubmit} isLoading={true} />);

        // The button text changes to "Logging In..." when loading
        const submitButton = screen.getByRole('button', { name: /logging in/i });
        expect(submitButton).toBeDisabled();
    });

    it('shows error message when login fails', () => {
        const errorMessage = 'Invalid credentials';
        render(<LoginForm onSubmit={mockOnSubmit} error={errorMessage} />);

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('toggles password visibility', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={mockOnSubmit} />);

        const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
        expect(passwordInput.type).toBe('password');

        const toggleButton = screen.getByRole('button', { name: /show password/i });
        await user.click(toggleButton);

        expect(passwordInput.type).toBe('text');
    });
});
