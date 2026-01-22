import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export interface Budget {
    id: string;
    userId: string;
    categoryId: string;
    name: string;
    amount: number; // Decimal in backend, number in frontend
    periodType: 'monthly' | 'semester' | 'yearly';
    startDate: string;
    endDate: string;
    alertThreshold: number;
    rollover: boolean;
    category?: {
        name: string;
        color: string;
        icon?: string;
    };
    spent?: number; // From status endpoint
    remaining?: number; // From status endpoint
    status?: 'safe' | 'warning' | 'exceeded'; // From status endpoint
}

export interface CreateBudgetDto {
    name: string;
    categoryId: string;
    amount: number;
    periodType: 'monthly' | 'semester' | 'yearly';
    startDate: string;
    endDate: string;
    alertThreshold?: number;
    rollover?: boolean;
}

export interface UpdateBudgetDto extends Partial<CreateBudgetDto> { }

export interface BudgetStatus {
    budgetId: string;
    category: {
        id: string;
        name: string;
        color: string;
    };
    period: string;
    limit: number;
    spent: number;
    remaining: number;
    percentage: number;
    status: 'safe' | 'warning' | 'danger' | 'exceeded';
    daysLeft: number;
    projectedSpending?: number;
    onTrack: boolean;
}

export interface BudgetFilters {
    periodType?: 'monthly' | 'semester' | 'yearly';
    isActive?: boolean;
}

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return { Authorization: `Bearer ${token}` };
};

// Analytics Interfaces
export interface BudgetAnalytics {
    budget: Budget & {
        totalSpent: number;
        remaining: number;
        percentUsed: number;
        daysRemaining: number;
    };
    stats: {
        avgDailySpend: number;
        projectedSpend: number;
        avgTransaction: number;
        transactionCount: number;
    };
    trend: { date: string; amount: number }[];
    breakdown: { name: string; value: number; percentage: number }[];
}

export const budgetService = {
    async getBudgets(filters: BudgetFilters = {}) {
        const params = new URLSearchParams();
        if (filters.periodType) params.append('periodType', filters.periodType);
        if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());

        const response = await axios.get<Budget[]>(API_ENDPOINTS.BUDGETS, {
            headers: getAuthHeader(),
            params
        });
        return response.data;
    },

    async getBudget(id: string) {
        const response = await axios.get<Budget>(`${API_ENDPOINTS.BUDGETS}/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async createBudget(data: CreateBudgetDto) {
        const response = await axios.post<Budget>(API_ENDPOINTS.BUDGETS, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async updateBudget(id: string, data: UpdateBudgetDto) {
        const response = await axios.put<Budget>(`${API_ENDPOINTS.BUDGETS}/${id}`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async deleteBudget(id: string) {
        await axios.delete(`${API_ENDPOINTS.BUDGETS}/${id}`, {
            headers: getAuthHeader()
        });
    },

    async getBudgetStatus(id: string) { // Single status
        const response = await axios.get<BudgetStatus>(`${API_ENDPOINTS.BUDGETS}/${id}/status`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async getBudgetStatuses() { // All statuses
        const response = await axios.get<BudgetStatus[]>(API_ENDPOINTS.BUDGETS_STATUS, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async getRecommendations() {
        const response = await axios.get<any>(`${API_ENDPOINTS.BUDGETS}/recommend`, { // Type as any for now or specific DTO
            headers: getAuthHeader()
        });
        return response.data;
    },

    async getBudgetAnalytics(budgetId: string) {
        const response = await axios.get<any>(`${API_ENDPOINTS.BUDGETS}/${budgetId}/analytics`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async getBudgetTransactions(budgetId: string, params?: { startDate?: string; endDate?: string, limit?: number }) {
        const response = await axios.get<any>(`${API_ENDPOINTS.BUDGETS}/${budgetId}/transactions`, {
            headers: getAuthHeader(),
            params
        });
        return response.data;
    }
};
