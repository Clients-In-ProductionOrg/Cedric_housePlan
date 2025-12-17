/**
 * Application Configuration Constants
 */

// Backend API Base URL - Use environment variable or default to localhost for dev
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// API Endpoints
export const API_ENDPOINTS = {
  PLANS: `${API_BASE_URL}/api/core/plans/`,
  PLAN_DETAIL: (id: string | number) => `${API_BASE_URL}/api/core/plans/${id}/`,
  SETTINGS: `${API_BASE_URL}/api/core/settings/`,
  CONTACTS: `${API_BASE_URL}/api/core/contacts/`,
  QUOTES: `${API_BASE_URL}/api/core/quotes/`,
};

// Frontend URL
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:8080';
