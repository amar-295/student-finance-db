import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { API_ENDPOINTS } from '../config/api';

const getAuthHeader = () => {
    const token = useAuthStore.getState().accessToken;
    return { Authorization: `Bearer ${token}` };
};

export interface HealthScore {
    total: number;
    breakdown: {
        budgeting: number;
        savings: number;
        spending: number;
        management: number;
    };
    message: string;
}

export interface Subscription {
    merchant: string;
    amount: number;
    frequency: string;
    lastPaid: string;
    estimatedNext: string;
}

export interface Recommendation {
    type: 'quick-win' | 'challenge' | 'alert';
    title: string;
    description: string;
    impact: string;
}

export interface SpendingPatterns {
    peakDay: string;
    peakCategory: string;
    weekendSpendIncrease: number;
}

export const aiService = {
    async getInsights() {
        const response = await axios.get<{ success: boolean; data: { score: Omit<HealthScore, 'message'>; message: string } }>(
            `${API_ENDPOINTS.AI_INSIGHTS}`,
            { headers: getAuthHeader() }
        );
        return {
            ...response.data.data.score,
            message: response.data.data.message
        };
    },

    async getSubscriptions() {
        const response = await axios.get<{ success: boolean; data: Subscription[] }>(
            `${API_ENDPOINTS.AI_INSIGHTS}/subscriptions`,
            { headers: getAuthHeader() }
        );
        return response.data.data;
    },

    async getRecommendations() {
        const response = await axios.get<{ success: boolean; data: Recommendation[] }>(
            `${API_ENDPOINTS.AI_INSIGHTS}/recommendations`,
            { headers: getAuthHeader() }
        );
        return response.data.data;
    },

    async getPatterns() {
        const response = await axios.get<{ success: boolean; data: SpendingPatterns }>(
            `${API_ENDPOINTS.AI_INSIGHTS}/patterns`,
            { headers: getAuthHeader() }
        );
        return response.data.data;
    }
};
