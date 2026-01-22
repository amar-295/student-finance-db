// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
    // Auth
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    REFRESH: `${API_BASE_URL}/api/auth/refresh`,

    // Accounts
    ACCOUNTS: `${API_BASE_URL}/api/accounts`,

    // Transactions
    TRANSACTIONS: `${API_BASE_URL}/api/transactions`,
    TRANSACTIONS_SUMMARY: `${API_BASE_URL}/api/transactions/summary`,

    // Categories
    CATEGORIES: `${API_BASE_URL}/api/categories`,

    // Budgets
    BUDGETS: `${API_BASE_URL}/api/budgets`,
    BUDGETS_STATUS: `${API_BASE_URL}/api/budgets/status`,

    // Bill Splits
    BILL_SPLITS: `${API_BASE_URL}/api/bill-splits`,
    GROUPS: `${API_BASE_URL}/api/groups`,

    // Analytics
    ANALYTICS_SPENDING: `${API_BASE_URL}/api/analytics/spending`,
    ANALYTICS_TRENDS: `${API_BASE_URL}/api/analytics/trends`,

    // AI
    AI_CATEGORIZE: `${API_BASE_URL}/api/ai/categorize`,
    AI_INSIGHTS: `${API_BASE_URL}/api/ai/insights`,

    // Reports
    REPORTS: `${API_BASE_URL}/api/reports`,

    // Health
    HEALTH: `${API_BASE_URL}/health`,
};

// Export base URL for custom endpoints
export { API_BASE_URL };
