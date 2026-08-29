// Environment Configuration Utility for Frontend
export const config = {
  appTitle: import.meta.env.VITE_APP_TITLE || 'AI-Agentix CRM',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://ai-agentix-crm.onrender.com/api',
  environment: import.meta.env.VITE_APP_ENV || 'development',
  isDev: import.meta.env.DEV,
};
