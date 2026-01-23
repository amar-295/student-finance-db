import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import ReportsPage from '@/pages/ReportsPage';
import { reportService } from '@/services/report.service';

// Mock Report Service
vi.mock('@/services/report.service', () => ({
    reportService: {
        getMonthlyReport: vi.fn(),
    }
}));

// Mock Sonner
vi.mock('sonner', () => ({
    toast: {
        promise: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
    },
    Toaster: () => null,
}));

const mockReportData = {
    summary: {
        income: 5000.00,
        expenses: 3500.50,
        netFlow: 1499.50
    },
    byCategory: [
        { name: 'Housing', amount: 1500.00 },
        { name: 'Food', amount: 600.50 },
        { name: 'Transport', amount: 200.00 }
    ]
};

describe('Reports Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (reportService.getMonthlyReport as any).mockResolvedValue(mockReportData);
    });

    it('renders reports page and generates a monthly report', async () => {
        const user = userEvent.setup();
        render(<ReportsPage />);

        // 1. Check Header
        expect(screen.getByText('Financial Reports')).toBeInTheDocument();

        // 2. Click Generate
        const generateBtn = screen.getByRole('button', { name: /Generate Report/i });
        await user.click(generateBtn);

        // 3. Wait for Preview
        await waitFor(() => {
            expect(screen.getByText('Report Preview')).toBeInTheDocument();
        });

        // 4. Verify Summary Cards
        expect(screen.getByText('$5000.00')).toBeInTheDocument(); // Income
        expect(screen.getByText('$3500.50')).toBeInTheDocument(); // Expenses
        expect(screen.getByText('$1499.50')).toBeInTheDocument(); // Net Flow

        // 5. Verify Table Data
        expect(screen.getByText('Housing')).toBeInTheDocument();
        expect(screen.getByText('$1500.00')).toBeInTheDocument();
        expect(screen.getByText('Food')).toBeInTheDocument();

        // 6. Verify Export Button presence
        expect(screen.getByRole('button', { name: /Export CSV/i })).toBeInTheDocument();
    });

    it('handles report generation error', async () => {
        const user = userEvent.setup();
        const errorMessage = 'Failed to fetch report';
        (reportService.getMonthlyReport as any).mockRejectedValue(new Error(errorMessage));

        render(<ReportsPage />);
        await user.click(screen.getByRole('button', { name: /Generate Report/i }));

        // Wait for error toast (Sonner)
        // Since we mocked sonner in setup/test-utils implicitly or explicitly
        const { toast } = await import('sonner');
        // Wait for promise rejection handling which calls toast.promise error
        await waitFor(() => {
            // In ReportsPage: toast.promise(..., { error: 'Failed to generate report' })
            // So we expect toast.promise to be called
            expect(toast.promise).toHaveBeenCalled();
        });
    });
});
