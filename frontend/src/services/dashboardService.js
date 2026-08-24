import api from './api';

export const getDashboardMetrics = async () => {
  try {
    const response = await api.get('/dashboard');
    return response.data;
  } catch (error) {
    console.error('Dashboard API error:', error);
    throw error;
  }
};
