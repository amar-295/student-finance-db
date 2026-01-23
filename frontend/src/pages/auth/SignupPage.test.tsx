import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import SignupPage from './SignupPage';
import { authService } from '../../services/auth.service';
// Build fix: removed unused useAuthStore import

// Mock dependencies
vi.mock('../../services/auth.service', async () => {
    const actual = await vi.importActual<any>('../../services/auth.service');
    return {
        ...actual,
        authService: {
            ...actual.authService,
            register: vi.fn(),
        },
    };
});

const mockSetAuth = vi.fn();
vi.mock('../../store/authStore', () => ({
    useAuthStore: () => mockSetAuth,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('SignupPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders signup page correctly', () => {
        render(<SignupPage />);
        expect(screen.getByText(/create an account/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    });

    it('shows validation error if terms are not accepted', async () => {
        const user = userEvent.setup();
        render(<SignupPage />);

        await user.type(screen.getByLabelText(/full name/i), 'John Doe');
        await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
        await user.type(screen.getByLabelText(/^password$/i), 'Password123!');
        await user.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(screen.getByText(/must accept the terms/i)).toBeInTheDocument();
        });
    });

    it('handles successful registration', async () => {
        const user = userEvent.setup();
        const mockAuthResponse = { user: { id: 1, name: 'John Doe' }, token: 'fake-token' };
        (authService.register as any).mockResolvedValue(mockAuthResponse);

        render(<SignupPage />);

        await user.type(screen.getByLabelText(/full name/i), 'John Doe');
        await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
        await user.type(screen.getByLabelText(/^password$/i), 'Password123!');
        await user.click(screen.getByLabelText(/i agree to the/i));

        await user.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(authService.register).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'Password123!',
            });
            expect(mockSetAuth).toHaveBeenCalledWith(mockAuthResponse);
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('handles registration failure', async () => {
        const user = userEvent.setup();
        const errorMessage = 'Email already exists';
        (authService.register as any).mockRejectedValue(new Error(errorMessage));

        render(<SignupPage />);

        await user.type(screen.getByLabelText(/full name/i), 'John Doe');
        await user.type(screen.getByLabelText(/email address/i), 'existing@example.com');
        await user.type(screen.getByLabelText(/^password$/i), 'Password123!');
        await user.click(screen.getByLabelText(/i agree to the/i));

        await user.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(authService.register).toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        const { toast } = await import('sonner');
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });

    it('toggles password visibility', async () => {
        const user = userEvent.setup();
        render(<SignupPage />);

        const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
        expect(passwordInput.type).toBe('password');

        const toggleButton = screen.getByLabelText(/toggle password visibility/i);
        await user.click(toggleButton);

        expect(passwordInput.type).toBe('text');
    });

    it('validates password strength indicators', async () => {
        const user = userEvent.setup();
        render(<SignupPage />);

        const passwordInput = screen.getByLabelText(/^password$/i);

        expect(screen.getByText('8+ Characters')).toBeInTheDocument();
        expect(screen.getByText('1 Number')).toBeInTheDocument();

        await user.clear(passwordInput);
        await user.type(passwordInput, 'Strong1!');

        expect(screen.getByText('1 Symbol')).toBeInTheDocument();
    });
});
