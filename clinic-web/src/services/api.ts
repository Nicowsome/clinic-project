// Import the mock API service that includes all mock data responses
import mockApi from './mockApiService';

// Re-export the mock API
const api = mockApi;

// Add token handling to localStorage for consistent behavior with the real app
export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const patientService = {
  getAll: () => api.get('/patients'),
  getById: (id: string) => api.get(`/patients/${id}`),
  create: (data: any) => api.post('/patients', data),
  update: (id: string, data: any) => api.put(`/patients/${id}`, data),
  delete: (id: string) => api.delete(`/patients/${id}`),
};

export const appointmentService = {
  getAll: () => api.get('/appointments'),
  getById: (id: string) => api.get(`/appointments/${id}`),
  create: (data: any) => api.post('/appointments', data),
  update: (id: string, data: any) => api.put(`/appointments/${id}`, data),
  delete: (id: string) => api.delete(`/appointments/${id}`),
};

export const authService = {
  login: (credentials: { email: string; password: string }) => {
    // Use the mock API directly
    return api.post('/auth/login', credentials);
  },
  register: (userData: any) => {
    // Use the mock API directly
    return api.post('/auth/register', userData);
  },
  logout: () => {
    // Clear token and user data
    clearAuthToken();
    window.location.href = '/login';
  }
};

export default api; 