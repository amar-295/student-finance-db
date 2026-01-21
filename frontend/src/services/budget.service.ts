import axios from 'axios';

const API_URL = '/api/budgets';

export interface Budget {
    id: string;
    userId: string;
    categoryId: string;
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

export const budgetService = {
    async getBudgets(filters: BudgetFilters = {}) {
        const params = new URLSearchParams();
        if (filters.periodType) params.append('periodType', filters.periodType);
        if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());

        const response = await axios.get<Budget[]>(API_URL, {
            headers: getAuthHeader(),
            params
        });
        return response.data;
    },

    async getBudget(id: string) {
        const response = await axios.get<Budget>(`${API_URL}/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async createBudget(data: CreateBudgetDto) {
        const response = await axios.post<Budget>(API_URL, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async updateBudget(id: string, data: UpdateBudgetDto) {
        const response = await axios.put<Budget>(`${API_URL}/${id}`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async deleteBudget(id: string) {
        await axios.delete(`${API_URL}/${id}`, {
            headers: getAuthHeader()
        });
    },

    async getBudgetStatus(id: string) { // Single status
        const response = await axios.get<BudgetStatus>(`${API_URL}/${id}/status`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async getBudgetStatuses() { // All statuses
        const response = await axios.get<BudgetStatus[]>(`${API_URL}/status`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async getRecommendations() {
        const response = await axios.get<any>(`${API_URL}/recommend`, { // Type as any for now or specific DTO
            headers: getAuthHeader()
        });
        return response.data;
    }
};
