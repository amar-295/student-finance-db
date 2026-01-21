import axios from 'axios';


const API_URL = '/api/transactions';

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
    date: string; // ISO string
    isSplit?: boolean;
    aiCategorized?: boolean;
}

export interface TransactionFilters {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
    search?: string;
    minAmount?: number;
    maxAmount?: number;
}

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return { Authorization: `Bearer ${token}` };
};

export const transactionService = {
    async getTransactions(filters: TransactionFilters = {}) {
        // Construct query params
        const params = new URLSearchParams();
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.categoryId) params.append('categoryId', filters.categoryId);
        if (filters.search) params.append('search', filters.search);

        const response = await axios.get<Transaction[]>(API_URL, {
            headers: getAuthHeader(),
            params
        });
        return response.data;
    },

    async createTransaction(data: Partial<Transaction>) {
        const response = await axios.post<Transaction>(API_URL, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async updateTransaction(id: string, data: Partial<Transaction>) {
        const response = await axios.put<Transaction>(`${API_URL}/${id}`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async deleteTransaction(id: string) {
        await axios.delete(`${API_URL}/${id}`, {
            headers: getAuthHeader()
        });
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
                        date: new Date().toISOString(),
                        category: { id: 'c1', name: 'Food & Dining', color: '#EF4444', icon: 'restaurant' },
                        aiCategorized: true
                    },
                    {
                        id: '2',
                        amount: -45.00,
                        description: 'Uber Ride',
                        merchant: 'Uber',
                        date: new Date(Date.now() - 86400000).toISOString(),
                        category: { id: 'c2', name: 'Transportation', color: '#3B82F6', icon: 'directions_car' },
                        aiCategorized: true
                    },
                    {
                        id: '3',
                        amount: 1500.00,
                        description: 'Salary Deposit',
                        merchant: 'Employer',
                        date: new Date(Date.now() - 172800000).toISOString(),
                        category: { id: 'c3', name: 'Income', color: '#10B981', icon: 'payments' },
                        aiCategorized: false
                    },
                    {
                        id: '4',
                        amount: -89.99,
                        description: 'Amazon Purchase',
                        merchant: 'Amazon',
                        date: new Date(Date.now() - 259200000).toISOString(),
                        category: { id: 'c4', name: 'Shopping', color: '#F59E0B', icon: 'shopping_bag' },
                        aiCategorized: true
                    }
                ]);
            }, 800);
        });
    }
};
