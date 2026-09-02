import api from './api';

export const getAnalytics = async () => {
  try {
    const response = await api.get('/analytics');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch analytics metrics';
    throw new Error(message);
  }
};
