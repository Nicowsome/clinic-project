import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL ? (import.meta as any).env.VITE_API_URL : 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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
    // Use direct URL to ensure correct path for login
    return axios.post('http://localhost:3000/api/v1/auth/login', credentials, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  },
  register: (userData: any) => axios.post('http://localhost:3000/api/v1/auth/register', userData, {
    headers: {
      'Content-Type': 'application/json',
    }
  }),
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
};

export default api; 