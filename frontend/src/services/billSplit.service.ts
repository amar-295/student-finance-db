import axios from 'axios';

const API_URL = '/api/bill-splits'; // Matches app.ts route

export interface SplitParticipant {
    id: string;
    userId: string;
    amountOwed: number;
    amountPaid: number;
    status: 'pending' | 'partial' | 'paid';
    paidAt?: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export interface SplitComment {
    id: string;
    splitId: string;
    userId: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export interface BillSplit {
    id: string;
    description: string;
    totalAmount: number;
    splitType: 'equal' | 'percentage' | 'custom';
    status: 'pending' | 'partial' | 'settled';
    billDate: string;
    createdBy: string;
    createdAt: string;
    participants: SplitParticipant[];
    creator: {
        id: string;
        name: string;
        email: string;
    };
}

export interface CreateSplitDto {
    description: string;
    totalAmount: number;
    splitType: 'equal' | 'percentage' | 'custom';
    billDate?: string;
    participants: {
        userId: string;
        amountOwed: number;
    }[];
}

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return { Authorization: `Bearer ${token}` };
};

export const billSplitService = {
    async getAllSplits() {
        const response = await axios.get<{ success: boolean; data: BillSplit[] }>(API_URL, {
            headers: getAuthHeader()
        });
        return response.data.data;
    },

    async getSplitById(id: string) {
        const response = await axios.get<{ success: boolean; data: BillSplit }>(`${API_URL}/${id}`, {
            headers: getAuthHeader()
        });
        return response.data.data;
    },

    async createSplit(data: CreateSplitDto) {
        const response = await axios.post<{ success: boolean; data: BillSplit }>(API_URL, data, {
            headers: getAuthHeader()
        });
        return response.data.data;
    },

    async settleShare(splitId: string, participantId: string) {
        const response = await axios.put<{ success: boolean; message: string }>(
            `${API_URL}/${splitId}/settle`,
            { participantId },
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    async deleteSplit(splitId: string) {
        const response = await axios.delete<{ success: boolean; message: string }>(`${API_URL}/${splitId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async addComment(splitId: string, content: string) {
        const response = await axios.post<{ success: boolean; data: SplitComment }>(
            `${API_URL}/${splitId}/comments`,
            { content },
            { headers: getAuthHeader() }
        );
        return response.data.data;
    },

    async getComments(splitId: string) {
        const response = await axios.get<{ success: boolean; data: SplitComment[] }>(
            `${API_URL}/${splitId}/comments`,
            { headers: getAuthHeader() }
        );
        return response.data.data;
    }
};
