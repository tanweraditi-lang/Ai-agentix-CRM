// Environment Configuration Utility for Frontend
export const config = {
  appTitle: import.meta.env.VITE_APP_TITLE || 'AI-Agentix CRM',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  environment: import.meta.env.VITE_APP_ENV || 'development',
  isDev: import.meta.env.DEV,
};
