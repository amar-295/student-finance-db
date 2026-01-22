import axios from 'axios';

const API_URL = '/api/reports';

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return { Authorization: `Bearer ${token}` };
};

export const reportService = {
    async getMonthlyReport(date: Date) {
        const response = await axios.get(`${API_URL}/monthly`, {
            headers: getAuthHeader(),
            params: { date: date.toISOString() }
        });
        return response.data.data;
    },

    async getSpendingReport(startDate: Date, endDate: Date) {
        const response = await axios.get(`${API_URL}/spending`, {
            headers: getAuthHeader(),
            params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            }
        });
        return response.data.data;
    }
};
