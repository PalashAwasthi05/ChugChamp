
import axios from 'axios';

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Request interceptor for adding the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth-related API calls
export const authAPI = {
  register: (userData: {
    username: string;
    email: string;
    password: string;
    height: number;
    weight: number;
    age: number;
    gender: string;
    metabolism: number;
  }) => {
    return api.post('/auth/register', userData);
  },
  
  login: (credentials: { email: string; password: string }) => {
    return api.post('/auth/login', credentials);
  },
};

// BAC-related API calls
export const bacAPI = {
  submitTest: (testData: {
    userId: string;
    measuredBAC: number;
    timeSinceShotMinutes: number;
  }) => {
    return api.post('/bac/test', testData);
  },
};

// Friend-related API calls
export const friendsAPI = {
  getRankings: (userId: string) => {
    return api.get(`/friends/rankings?userId=${userId}`);
  },
};

export default api;
