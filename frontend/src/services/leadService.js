import api from './api';

export const getLeads = async (params = {}) => {
  try {
    const response = await api.get('/leads', { params });
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

export const createLead = async (leadData) => {
  try {
    const response = await api.post('/leads', leadData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create lead';
    throw new Error(message);
  }
};

export const updateLead = async (id, updateData) => {
  try {
    const response = await api.put(`/leads/${id}`, updateData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update lead';
    throw new Error(message);
  }
};

export const deleteLead = async (id) => {
  try {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete lead';
    throw new Error(message);
  }
};
