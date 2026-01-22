import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return { Authorization: `Bearer ${token}` };
};

export const reportService = {
    async getMonthlyReport(date: Date) {
        const response = await axios.get(`${API_ENDPOINTS.REPORTS}/monthly`, {
            headers: getAuthHeader(),
            params: { date: date.toISOString() }
        });
        return response.data.data;
    },

    async getSpendingReport(startDate: Date, endDate: Date) {
        const response = await axios.get(`${API_ENDPOINTS.REPORTS}/spending`, {
            headers: getAuthHeader(),
            params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            }
        });
        return response.data.data;
    }
};
