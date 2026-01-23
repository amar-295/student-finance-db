import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import AnalyticsPage from '@/pages/AnalyticsPage';
import { analyticsService } from '@/services/analytics.service';

// Mock Recharts to render children immediately (avoid sizing issues)
vi.mock('recharts', async () => {
    const OriginalModule = await vi.importActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }: any) => <div style={{ width: 500, height: 300 }} data-testid="responsive-container">{children}</div>,
    };
});

// Mock Analytics Service
vi.mock('@/services/analytics.service', () => ({
    analyticsService: {
        getOverview: vi.fn(),
        getTrends: vi.fn(),
        getCategories: vi.fn(),
        getMerchants: vi.fn(),
        getInsights: vi.fn(),
    }
}));

const mockOverview = {
    income: { total: 5000, change: 10 },
    expenses: { total: 3000, change: -5 },
    savings: { total: 2000, change: 15 }
};

const mockTrends = [
    { name: 'Jan', income: 4000, expenses: 2000 },
    { name: 'Feb', income: 4500, expenses: 2500 },
];

const mockCategories = [
    { name: 'Food', color: '#ff0000', value: 500 },
    { name: 'Transport', color: '#00ff00', value: 300 },
];

const mockMerchants = [
    { name: 'Uber', amount: 50, count: 5 },
    { name: 'Starbucks', amount: 20, count: 10 },
];

const mockInsights = [
    { type: 'warning', title: 'High Spending', message: 'You spent a lot on food.' },
    { type: 'suggestion', title: 'Save More', message: 'Try cooking at home.' },
];

describe('Analytics Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (analyticsService.getOverview as any).mockResolvedValue(mockOverview);
        (analyticsService.getTrends as any).mockResolvedValue(mockTrends);
        (analyticsService.getCategories as any).mockResolvedValue(mockCategories);
        (analyticsService.getMerchants as any).mockResolvedValue(mockMerchants);
        (analyticsService.getInsights as any).mockResolvedValue(mockInsights);
    });

    it('renders analytics dashboard with all sections', async () => {
        render(<AnalyticsPage />);

        // 1. Verify Header
        expect(await screen.findByText('Financial Analytics')).toBeInTheDocument();

        // 2. Verify Overview Cards
        expect(await screen.findByText('Total Income')).toBeInTheDocument();
        expect(screen.getByText('$5,000.00')).toBeInTheDocument(); // Income
        expect(screen.getByText('$3,000.00')).toBeInTheDocument(); // Expenses
        expect(screen.getByText('$2,000.00')).toBeInTheDocument(); // Savings

        // 3. Verify Charts Sections
        expect(screen.getByText('Spending Trends')).toBeInTheDocument();
        expect(screen.getByText('Spending by Category')).toBeInTheDocument();

        // 4. Verify Merchants
        expect(screen.getByText('Top Merchants')).toBeInTheDocument();
        expect(screen.getByText('Uber')).toBeInTheDocument();
        expect(screen.getByText('Starbucks')).toBeInTheDocument();

        // 5. Verify Insights
        expect(screen.getByText('AI Financial Insights')).toBeInTheDocument();
        expect(screen.getByText('High Spending')).toBeInTheDocument();
        expect(screen.getByText('Save More')).toBeInTheDocument();
    });

    it('fetches trends based on selected period', async () => {
        const user = userEvent.setup();
        render(<AnalyticsPage />);

        // Wait for content to load
        await screen.findByText('Financial Analytics');

        // Defaults to 'month'
        await waitFor(() => {
            expect(analyticsService.getTrends).toHaveBeenCalledWith('month');
        });

        // Click 'week'
        const weekBtn = screen.getByRole('button', { name: /week/i });
        await user.click(weekBtn);

        await waitFor(() => {
            expect(analyticsService.getTrends).toHaveBeenCalledWith('week');
        });

        // Click 'year'
        const yearBtn = screen.getByRole('button', { name: /year/i });
        await user.click(yearBtn);

        await waitFor(() => {
            expect(analyticsService.getTrends).toHaveBeenCalledWith('year');
        });
    });
});
