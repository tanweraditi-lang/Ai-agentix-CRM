import api from './api';

export const getConversations = async (params = {}) => {
  try {
    const response = await api.get('/conversations', { params });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch conversations';
    throw new Error(message);
  }
};

export const getConversationById = async (id) => {
  try {
    const response = await api.get(`/conversations/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch conversation details';
    throw new Error(message);
  }
};

export const createConversation = async (data) => {
  try {
    const response = await api.post('/conversations', data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create conversation';
    throw new Error(message);
  }
};

export const updateConversation = async (id, data) => {
  try {
    const response = await api.put(`/conversations/${id}`, data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update conversation';
    throw new Error(message);
  }
};

export const convertConversationToLead = async (id) => {
  try {
    const response = await api.post(`/conversations/${id}/convert-lead`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to convert conversation to lead';
    throw new Error(message);
  }
};

export const deleteConversation = async (id) => {
  try {
    const response = await api.delete(`/conversations/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete conversation';
    throw new Error(message);
  }
};
