// src/api/axiosInstance.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_DEV;
if (!API_BASE_URL) {
    throw new Error("API base URL is not defined in the environment variables");
}

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 10000,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Optional: trigger logout or redirect
                    break;
                case 403:
                    throw new Error('You are not authorized');
                case 404:
                    throw new Error('Resource not found');
                default:
                    throw new Error(error.response.data?.message || 'An error occurred');
            }
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('Request setup error');
        }
    }
);

export default api;
