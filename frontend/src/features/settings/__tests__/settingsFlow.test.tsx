import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import SettingsPage from '@/pages/SettingsPage';

// Mock matchMedia for system theme (usually mocked in setup.ts but good to be safe/explicit if logic depends on it)
// setup.ts should have it.

describe('Settings Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        // Reset document classes
        document.documentElement.className = '';
    });

    it('toggles theme between light and dark modes', async () => {
        const user = userEvent.setup();
        render(<SettingsPage />);

        // 1. Navigate to Preferences
        const prefTab = screen.getByRole('button', { name: /Preferences/i });
        await user.click(prefTab);

        // 2. Initial State (assuming default is system/light)
        // Check for Light Mode button
        const lightBtn = screen.getByRole('button', { name: /light/i });
        const darkBtn = screen.getByRole('button', { name: /dark/i });

        expect(lightBtn).toBeInTheDocument();
        expect(darkBtn).toBeInTheDocument();

        // 3. Switch to Dark Mode
        await user.click(darkBtn);

        // Verify Class on <html>
        await waitFor(() => {
            expect(document.documentElement.classList.contains('dark')).toBe(true);
        });

        // Verify LocalStorage
        expect(localStorage.getItem('uniflow-theme')).toBe('dark');

        // 4. Switch back to Light Mode
        await user.click(lightBtn);

        // Verify Class removed
        await waitFor(() => {
            expect(document.documentElement.classList.contains('dark')).toBe(false);
        });

        // Verify LocalStorage
        expect(localStorage.getItem('uniflow-theme')).toBe('light');
    });

    it('navigates through settings tabs', async () => {
        const user = userEvent.setup();
        render(<SettingsPage />);

        // Profile is default
        expect(screen.getByText(/Profile Settings/i)).toBeInTheDocument();

        // Click Preferences
        await user.click(screen.getByRole('button', { name: /Preferences/i }));
        expect(screen.getByText(/Appearance/i)).toBeInTheDocument();
        // Profile should be gone
        expect(screen.queryByText(/Profile Settings/i)).not.toBeInTheDocument();

        // Click Categories
        await user.click(screen.getByRole('button', { name: /Categories/i }));
        expect(screen.getByRole('button', { name: /Add Category/i })).toBeInTheDocument();

        // Click Security
        await user.click(screen.getByRole('button', { name: /Security/i }));
        expect(screen.getByText(/Security settings coming soon/i)).toBeInTheDocument();
    });
});
