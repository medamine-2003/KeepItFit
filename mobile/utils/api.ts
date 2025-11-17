// mobile/utils/api.ts
import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl || "http://192.168.1.122:8000";

const isDevelopment = __DEV__;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Silent token retrieval error
    }
    
    // Only log in development mode
    if (isDevelopment) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    // Only log in development mode
    if (isDevelopment) {
      console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    }
    return response;
  },
  async (error) => {
    // Enhance error messages but don't log to console in production
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. Please check your connection.';
    } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      error.message = `Cannot connect to server. Please check your internet connection.`;
    }
    
    // Only log detailed errors in development
    if (isDevelopment) {
      if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url,
        });
      } else {
        console.error('API Error:', error.message);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
