import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = '/api/ai';

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
            `${API_URL}/insights`,
            { headers: getAuthHeader() }
        );
        return {
            ...response.data.data.score,
            message: response.data.data.message
        };
    },

    async getSubscriptions() {
        const response = await axios.get<{ success: boolean; data: Subscription[] }>(
            `${API_URL}/subscriptions`,
            { headers: getAuthHeader() }
        );
        return response.data.data;
    },

    async getRecommendations() {
        const response = await axios.get<{ success: boolean; data: Recommendation[] }>(
            `${API_URL}/recommendations`,
            { headers: getAuthHeader() }
        );
        return response.data.data;
    },

    async getPatterns() {
        const response = await axios.get<{ success: boolean; data: SpendingPatterns }>(
            `${API_URL}/patterns`,
            { headers: getAuthHeader() }
        );
        return response.data.data;
    }
};
