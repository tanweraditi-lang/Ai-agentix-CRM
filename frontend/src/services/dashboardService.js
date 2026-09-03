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

export const getLeadTrend = async () => {
  const response = await api.get('/dashboard/lead-trend');
  return response.data;
};

export const getStatusDistribution = async () => {
  const response = await api.get('/dashboard/status-distribution');
  return response.data;
};

export const getServiceDistribution = async () => {
  const response = await api.get('/dashboard/service-distribution');
  return response.data;
};

export const getLeadSourceDistribution = async () => {
  const response = await api.get('/dashboard/lead-source');
  return response.data;
};

export const getConversationTrend = async () => {
  const response = await api.get('/dashboard/conversation-trend');
  return response.data;
};

export const getDailyChatbotUsage = async () => {
  const response = await api.get('/dashboard/daily-chatbot-usage');
  return response.data;
};

export const getChatbotAnalytics = async () => {
  const response = await api.get('/dashboard/chatbot-analytics');
  return response.data;
};

export const getRevenueTrend = async () => {
  const response = await api.get('/dashboard/revenue');
  return response.data;
};

export const getFollowupSummary = async () => {
  const response = await api.get('/dashboard/followup-summary');
  return response.data;
};

export const getConversionFunnel = async () => {
  const response = await api.get('/dashboard/conversion-funnel');
  return response.data;
};
