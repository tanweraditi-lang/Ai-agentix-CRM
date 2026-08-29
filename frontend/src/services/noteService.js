import api from './api';

export const getLeadNotes = async (leadId) => {
  try {
    const response = await api.get(`/leads/${leadId}/notes`);
    return response.data;
  } catch (error) {
    console.error(`Get notes error for lead ${leadId}:`, error);
    throw error;
  }
};

export const createNote = async (leadId, noteData) => {
  try {
    const response = await api.post(`/leads/${leadId}/notes`, noteData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create note';
    throw new Error(message);
  }
};

export const updateNote = async (noteId, noteData) => {
  try {
    const response = await api.put(`/notes/${noteId}`, noteData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update note';
    throw new Error(message);
  }
};

export const deleteNote = async (noteId) => {
  try {
    const response = await api.delete(`/notes/${noteId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete note';
    throw new Error(message);
  }
};

export const getLeadActivity = async (leadId) => {
  try {
    const response = await api.get(`/leads/${leadId}/activity`);
    return response.data;
  } catch (error) {
    console.error(`Get activity error for lead ${leadId}:`, error);
    throw error;
  }
};
