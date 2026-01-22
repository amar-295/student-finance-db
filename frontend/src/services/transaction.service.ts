import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export interface Transaction {
    id: string;
    amount: number;
    description: string; // or merchant
    merchant?: string;
    categoryId?: string;
    category?: {
        id: string;
        name: string;
        color: string;
        icon: string;
    };
    transactionDate: string; // ISO string
    accountId?: string;
    type?: 'INCOME' | 'EXPENSE';
    isSplit?: boolean;
    aiCategorized?: boolean;
    status?: 'pending' | 'cleared' | 'reconciled';
    receiptUrl?: string;
}

export interface BulkUpdateInput {
    transactionIds: string[];
    categoryId?: string;
    status?: 'pending' | 'cleared' | 'reconciled';
    accountId?: string;
}

export interface TransactionFilters {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
    search?: string;
    minAmount?: number;
    maxAmount?: number;
    limit?: number;
    page?: number;
    sortBy?: 'date' | 'amount' | 'merchant' | 'category';
    sortOrder?: 'asc' | 'desc';
}

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return { Authorization: `Bearer ${token}` };
};

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasMore: boolean;
    };
}

export const transactionService = {
    async getTransactions(filters: TransactionFilters = {}) {
        // Construct query params
        const params = new URLSearchParams();
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.categoryId) params.append('categoryId', filters.categoryId);
        if (filters.search) params.append('search', filters.search);
        if (filters.limit) params.append('limit', filters.limit.toString());
        // Add other params manually passed in filter object if they exist in type, 
        // but for page/sort they are passed mixed. 
        // We really should extend TransactionFilters to include them or pass separate args.
        // For now, let's coerce filters to any to read page/sort
        const f = filters as any;
        if (f.page) params.append('page', f.page.toString());
        if (f.sortBy) params.append('sortBy', f.sortBy);
        if (f.sortOrder) params.append('sortOrder', f.sortOrder);

        const response = await axios.get<PaginatedResponse<Transaction>>(API_ENDPOINTS.TRANSACTIONS, {
            headers: getAuthHeader(),
            params
        });
        return response.data;
    },

    async createTransaction(data: Partial<Transaction>) {
        const response = await axios.post<Transaction>(API_ENDPOINTS.TRANSACTIONS, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async updateTransaction(id: string, data: Partial<Transaction>) {
        const response = await axios.put<Transaction>(`${API_ENDPOINTS.TRANSACTIONS}/${id}`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async deleteTransaction(id: string) {
        await axios.delete(`${API_ENDPOINTS.TRANSACTIONS}/${id}`, {
            headers: getAuthHeader()
        });
    },

    async bulkUpdate(data: BulkUpdateInput) {
        const response = await axios.put<{ success: boolean; data: Transaction[] }>(
            `${API_ENDPOINTS.TRANSACTIONS}/bulk/update`,
            data,
            { headers: getAuthHeader() }
        );
        return response.data.data;
    },

    async bulkDelete(transactionIds: string[]) {
        const response = await axios.post<{ success: boolean; data: string[] }>(
            `${API_ENDPOINTS.TRANSACTIONS}/bulk/delete`,
            { transactionIds },
            { headers: getAuthHeader() }
        );
        return response.data.data;
    },

    // Mock data function for development until backend is fully ready
    async getMockTransactions(): Promise<Transaction[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: '1',
                        amount: -12.50,
                        description: 'Starbucks Coffee',
                        merchant: 'Starbucks',
                        transactionDate: new Date().toISOString(),
                        category: { id: 'c1', name: 'Food & Dining', color: '#EF4444', icon: 'restaurant' },
                        aiCategorized: true,
                        accountId: '1'
                    },
                    {
                        id: '2',
                        amount: -45.00,
                        description: 'Uber Ride',
                        merchant: 'Uber',
                        transactionDate: new Date(Date.now() - 86400000).toISOString(),
                        category: { id: 'c2', name: 'Transportation', color: '#3B82F6', icon: 'directions_car' },
                        aiCategorized: true,
                        accountId: '1'
                    },
                    {
                        id: '3',
                        amount: 1500.00,
                        description: 'Salary Deposit',
                        merchant: 'Employer',
                        transactionDate: new Date(Date.now() - 172800000).toISOString(),
                        category: { id: 'c3', name: 'Income', color: '#10B981', icon: 'payments' },
                        aiCategorized: false,
                        accountId: '1'
                    },
                    {
                        id: '4',
                        amount: -89.99,
                        description: 'Amazon Purchase',
                        merchant: 'Amazon',
                        transactionDate: new Date(Date.now() - 259200000).toISOString(),
                        category: { id: 'c4', name: 'Shopping', color: '#F59E0B', icon: 'shopping_bag' },
                        aiCategorized: true,
                        accountId: '1'
                    }
                ]);
            }, 800);
        });
    }
};
