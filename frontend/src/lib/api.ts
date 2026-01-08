import axios from 'axios';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    return `${window.location.origin.replace(/\/$/, '')}/api`;
  }

  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL:
    typeof window === 'undefined'
      ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      : undefined,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token and ensure baseURL on each request
api.interceptors.request.use((config) => {
  if (!config.baseURL) {
    config.baseURL = getBaseUrl();
  }

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: async (email: string, password: string, name?: string) => {
    const response = await api.post('/auth/signup', { email, password, name });
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Investment API
export const investmentAPI = {
  getAll: async () => {
    const response = await api.get('/investments');
    return response.data;
  },
  create: async (data: {
    plan: string;
    amount: number;
    crypto: string;
    txHash: string;
    duration?: number;
  }) => {
    const response = await api.post('/investments', data);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/investments/${id}`);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/investments/${id}`);
    return response.data;
  },
};

// Wallet API
export const walletAPI = {
  getAddresses: async () => {
    const response = await api.get('/wallet/addresses');
    return response.data;
  },
  getPlans: async () => {
    const response = await api.get('/wallet/plans');
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/wallet/stats');
    return response.data;
  },
  payGasFee: async (data: {
    crypto: string;
    txHash: string;
  }) => {
    const response = await api.post('/wallet/pay-gas-fee', data);
    return response.data;
  },
};

export default api;

