import api from './api';

export const getLeads = async () => {
  try {
    const response = await api.get('/leads');
    return response.data;
  } catch (error) {
    console.error('Lead API error:', error);
    throw error;
  }
};

export const getLeadById = async (id) => {
  try {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lead Detail API error for ID ${id}:`, error);
    throw error;
  }
};
