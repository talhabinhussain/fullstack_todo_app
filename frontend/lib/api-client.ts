import axios from 'axios';
import { TokenManager } from '@/utils/token-manager';

// Create an axios instance
const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api`,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = TokenManager.getAccessToken();
    if (token && !TokenManager.isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid - clear stored tokens and redirect to login
      TokenManager.removeTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Specific API functions for tasks
export const taskApi = {
  getTasks: (userId: string) => {
    return apiClient.get(`/${userId}/tasks`);
  },
  createTask: (userId: string, taskData: { title: string; description?: string; priority?: "low" | "medium" | "high"; due_date?: string }) => {
    return apiClient.post(`/${userId}/tasks`, taskData);
  },
  updateTask: (userId: string, taskId: string, taskData: { title?: string; description?: string; is_completed?: boolean; priority?: "low" | "medium" | "high"; due_date?: string }) => {
    return apiClient.put(`/${userId}/tasks/${taskId}`, taskData);
  },
  deleteTask: (userId: string, taskId: string) => {
    return apiClient.delete(`/${userId}/tasks/${taskId}`);
  }
};

// Generic API functions
export const api = {
  get: (url: string) => apiClient.get(url),
  post: (url: string, data: any) => apiClient.post(url, data),
  put: (url: string, data: any) => apiClient.put(url, data),
  delete: (url: string) => apiClient.delete(url)
};