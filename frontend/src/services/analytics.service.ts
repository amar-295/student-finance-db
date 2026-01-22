import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = '/api/analytics';

const getAuthHeader = () => {
    const token = useAuthStore.getState().accessToken;
    return { Authorization: `Bearer ${token}` };
};

export interface AnalyticsOverview {
    income: { total: number; change: number };
    expenses: { total: number; change: number };
    savings: { total: number; change: number };
}

export interface SpendingTrend {
    name: string;
    income: number;
    expenses: number;
}

export interface CategoryBreakdown {
    name: string;
    color: string;
    value: number;
}

export interface TopMerchant {
    name: string;
    amount: number;
    count: number;
}

export interface AIInsight {
    type: 'warning' | 'suggestion' | 'info';
    title: string;
    message: string;
}

export const analyticsService = {
    async getOverview() {
        const response = await axios.get<{ success: boolean; data: AnalyticsOverview }>(
            `${API_URL}/overview`,
            { headers: getAuthHeader() }
        );
        return response.data.data;
    },

    async getTrends(period: 'week' | 'month' | 'year') {
        const response = await axios.get<{ success: boolean; data: SpendingTrend[] }>(
            `${API_URL}/trends`,
            { headers: getAuthHeader(), params: { period } }
        );
        return response.data.data;
    },

    async getCategories() {
        const response = await axios.get<{ success: boolean; data: CategoryBreakdown[] }>(
            `${API_URL}/categories`,
            { headers: getAuthHeader() }
        );
        return response.data.data;
    },

    async getMerchants() {
        const response = await axios.get<{ success: boolean; data: TopMerchant[] }>(
            `${API_URL}/merchants`,
            { headers: getAuthHeader() }
        );
        return response.data.data;
    },

    async getInsights() {
        const response = await axios.get<{ success: boolean; data: AIInsight[] }>(
            `${API_URL}/ai-insights`,
            { headers: getAuthHeader() }
        );
        return response.data.data;
    }
};
