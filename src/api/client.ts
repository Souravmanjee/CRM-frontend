import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: attach auth token + active business ID on every request
apiClient.interceptors.request.use(
    (config) => {
        // Attach auth token
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Attach active business ID from localStorage (faster than Zustand getter on cold start)
        try {
            const raw = localStorage.getItem('activeBusiness');
            if (raw) {
                const business = JSON.parse(raw);
                if (business?._id) {
                    config.headers['x-business-id'] = business._id;
                }
            }
        } catch { }

        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized, logging out...');
            useAuthStore.getState().clearAuth();
        }
        return Promise.reject(error);
    }
);
