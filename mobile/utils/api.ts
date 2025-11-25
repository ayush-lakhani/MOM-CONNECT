import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// CHANGE THIS if testing on device — use your machine IP
const LOCAL_HOST = 'http://10.49.129.67:5000';
const API_BASE = `${LOCAL_HOST}/api`;

console.log('API_BASE:', API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: any) => {
    console.log('Calling register API with:', data);
    return api.post('/auth/register', data);
  },
  login: (data: any) => {
    console.log('Calling login API with:', data);
    return api.post('/auth/login', data);
  },
};

export const communityAPI = {
  getPosts: () => api.get('/community/posts'),
  createPost: (payload: any) => api.post('/community/posts', payload),
  likePost: (postId: string) => api.post(`/community/posts/${postId}/like`),
  commentPost: (postId: string, payload: any) =>
    api.post(`/community/posts/${postId}/comment`, payload),
};

export const marketplaceAPI = {
  getProducts: () => api.get('/marketplace/products'),
  createProduct: (payload: any) => api.post('/marketplace/products', payload),
  getProduct: (id: string) => api.get(`/marketplace/products/${id}`),
};

export const dashboardAPI = {
  getDashboard: (userId: string) => api.get(`/dashboard/${userId}`),
  verifyUser: (userId: string) => api.put(`/dashboard/${userId}/verify`),
};

export default api;