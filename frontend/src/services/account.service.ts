

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export type AccountType = 'checking' | 'savings' | 'credit' | 'cash' | 'other';

export interface Account {
    id: string;
    userId: string;
    name: string;
    accountType: AccountType;
    balance: number;
    currency: string;
    institution?: string;
    accountNumber?: string;
    createdAt: string;
    updatedAt: string;
}

export const accountService = {
    async getAccounts(): Promise<Account[]> {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/accounts`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized. Please login again.');
            }
            throw new Error('Failed to fetch accounts');
        }

        const json = await response.json();
        return json.data;
    },

    async getMockAccounts(): Promise<Account[]> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        return [
            {
                id: '1',
                userId: 'u1',
                name: 'Chase Student Checking',
                accountType: 'checking',
                balance: 2450.5,
                currency: 'USD',
                institution: 'Chase',
                accountNumber: '4321',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: '2',
                userId: 'u1',
                name: 'High Yield Savings',
                accountType: 'savings',
                balance: 10000.0,
                currency: 'USD',
                institution: 'Marcus',
                accountNumber: '9982',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: '3',
                userId: 'u1',
                name: 'Discover Student Chrome',
                accountType: 'credit',
                balance: -1200.0,
                currency: 'USD',
                institution: 'Discover',
                accountNumber: '1122',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: '4',
                userId: 'u1',
                name: 'Federal Student Loan',
                accountType: 'other',
                balance: -2000.0,
                currency: 'USD',
                institution: 'Navient',
                accountNumber: '5678',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];
    },
};
