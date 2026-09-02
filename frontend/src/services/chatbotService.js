import api from './api';

export const getChatbots = async (params = {}) => {
  try {
    const response = await api.get('/chatbots', { params });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch chatbots';
    throw new Error(message);
  }
};

export const getChatbotById = async (id) => {
  try {
    const response = await api.get(`/chatbots/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch chatbot details';
    throw new Error(message);
  }
};

export const createChatbot = async (data) => {
  try {
    const response = await api.post('/chatbots', data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create chatbot';
    throw new Error(message);
  }
};

export const updateChatbot = async (id, data) => {
  try {
    const response = await api.put(`/chatbots/${id}`, data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update chatbot';
    throw new Error(message);
  }
};

export const deleteChatbot = async (id) => {
  try {
    const response = await api.delete(`/chatbots/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete chatbot';
    throw new Error(message);
  }
};
