import axios from 'axios';
import { Platform } from 'react-native';

// Use localhost for iOS simulator, 10.0.2.2 for Android emulator
const API_URL = 'http://10.90.125.67:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getPosts = async () => {
    try {
        const response = await api.get('/community/posts');
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const getProducts = async () => {
    try {
        const response = await api.get('/marketplace/products');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const createPost = async (data: any, token: string) => {
    try {
        const response = await api.post('/community/posts', data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

export const dashboardAPI = {
    getDashboard: (userId: string) => api.get(`/dashboard/${userId}`),
    updateProfile: (userId: string, data: any) => api.put(`/dashboard/${userId}`, data),
};

export default api;
