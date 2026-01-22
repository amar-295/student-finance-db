import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('Authentication Flow', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('completes full login flow', async () => {
        const user = userEvent.setup();

        render(<LoginPage />);

        await user.type(screen.getByLabelText(/email address/i), 'alex@demo.com');
        await user.type(screen.getByPlaceholderText(/••••••••/i), 'DemoPassword123');
        await user.click(screen.getByRole('button', { name: /log in/i }));

        // Wait for successful login and storage update with safe parsing
        await waitFor(() => {
            const authRaw = localStorage.getItem('auth-storage');
            if (!authRaw) throw new Error('Auth storage not yet updated');

            const authData = JSON.parse(authRaw);
            expect(authData?.state?.accessToken).toBe('mock-token');
        }, { timeout: 3000 });
    });

    it('handles login error gracefully', async () => {
        const user = userEvent.setup();

        server.use(
            http.post('/api/auth/login', () => {
                return HttpResponse.json(
                    { message: 'Invalid credentials' },
                    { status: 401 }
                );
            })
        );

        render(<LoginPage />);

        await user.type(screen.getByLabelText(/email address/i), 'wrong@email.com');
        await user.type(screen.getByPlaceholderText(/••••••••/i), 'wrongpassword');
        await user.click(screen.getByRole('button', { name: /log in/i }));

        // Check for error message - specifically look for the toast or error message text
        await waitFor(() => {
            // In UniFlow, errors are often shown via toasts or inline
            expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
        });
    });

    it('redirects to login when accessing protected route', async () => {
        // If we're not authenticated, the page shouldn't show content or the store should show it.
        // For this bridge test, we just check that redirect happened in location.
        render(<DashboardPage />);

        await waitFor(() => {
            expect(window.location.pathname).toBe('/login');
        });
    });

    it('persists authentication across page reloads', async () => {
        const mockAuth = {
            state: {
                user: { id: '1', email: 'alex@demo.com', firstName: 'Alex' },
                accessToken: 'mock-token',
                isAuthenticated: true
            },
            version: 0
        };
        localStorage.setItem('auth-storage', JSON.stringify(mockAuth));

        render(<DashboardPage />);

        await waitFor(() => {
            expect(screen.getByText(/Good morning/i)).toBeInTheDocument();
            expect(screen.getByText(/Alex/i)).toBeInTheDocument();
        });
    });
});
