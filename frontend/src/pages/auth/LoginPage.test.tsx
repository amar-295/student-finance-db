import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';
import { authService } from '../../services/auth.service';


// Mock dependencies
vi.mock('../../services/auth.service', async () => {
    const actual = await vi.importActual<any>('../../services/auth.service');
    return {
        ...actual,
        authService: {
            ...actual.authService,
            login: vi.fn(),
        },
    };
});

// Mock store
const mockSetAuth = vi.fn();
vi.mock('../../store/authStore', () => ({
    useAuthStore: (_selector: any) => {
        // Mock state implementation based on selector usage
        // In LoginPage: useAuthStore(state => state.setAuth)
        // We can just return mockSetAuth for simplicity if we know how it's used,
        // or implement a proper selector mock.
        return mockSetAuth;
    },
}));

// Mock React Router's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock sonner toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login page correctly', () => {
        render(<LoginPage />);
        expect(screen.getByText(/log in to your account/i)).toBeInTheDocument();
        // There are multiple "Welcome back" texts (slide title and form subtitle)
        expect(screen.getAllByText(/welcome back/i).length).toBeGreaterThan(0);
    });

    it('handles successful login', async () => {
        const user = userEvent.setup();
        const mockAuthResponse = { user: { id: 1, name: 'Test User' }, token: 'fake-token' };
        (authService.login as any).mockResolvedValue(mockAuthResponse);

        render(<LoginPage />);

        // Fill in the form (LoginForm)
        await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
        await user.type(screen.getByLabelText(/^password$/i), 'Password123');

        // Click login
        await user.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'Password123',
            });
            expect(mockSetAuth).toHaveBeenCalledWith(mockAuthResponse);
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('handles login failure', async () => {
        const user = userEvent.setup();
        const errorMessage = 'Invalid credentials';
        (authService.login as any).mockRejectedValue(new Error(errorMessage));

        render(<LoginPage />);

        // Fill in the form
        await user.type(screen.getByLabelText(/email address/i), 'wrong@example.com');
        await user.type(screen.getByLabelText(/^password$/i), 'WrongPass');

        // Click login
        await user.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalled();
            // Since toast is mocked, we can check if it was called (optional)
            // But mainly we verify it doesn't navigate
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        // Check if toast error was called
        const { toast } = await import('sonner');
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });

    it('toggles remember me checkbox', async () => {
        const user = userEvent.setup();
        render(<LoginPage />);

        const checkbox = screen.getByLabelText(/remember me/i);
        expect(checkbox).not.toBeChecked();

        await user.click(checkbox);
        expect(checkbox).toBeChecked();
    });
});
