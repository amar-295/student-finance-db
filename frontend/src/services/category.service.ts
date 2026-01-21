import axios from 'axios';

const API_URL = '/api/categories';

export interface Category {
    id: string;
    name: string;
    type: 'income' | 'expense';
    color: string;
    icon?: string;
    isSystem: boolean;
}

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return { Authorization: `Bearer ${token}` };
};

export const categoryService = {
    async getCategories() {
        const response = await axios.get<Category[]>(API_URL, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async createCategory(data: Partial<Category>) {
        const response = await axios.post<Category>(API_URL, data, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};
