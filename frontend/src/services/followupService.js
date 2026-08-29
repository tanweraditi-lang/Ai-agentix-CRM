import api from './api';

export const getFollowups = async () => {
  try {
    const response = await api.get('/followups');
    return response.data;
  } catch (error) {
    console.error('Follow-up API fetch error:', error);
    throw error;
  }
};

export const createFollowup = async (followupData) => {
  try {
    const response = await api.post('/followups', followupData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to schedule task';
    throw new Error(message);
  }
};

export const updateFollowup = async (id, updateData) => {
  try {
    const response = await api.put(`/followups/${id}`, updateData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update task';
    throw new Error(message);
  }
};

export const deleteFollowup = async (id) => {
  try {
    const response = await api.delete(`/followups/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete task';
    throw new Error(message);
  }
};
