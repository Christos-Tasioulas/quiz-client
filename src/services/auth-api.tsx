import type {User, UserCredentials} from "../types/BasicTypes.tsx";
import api from './axiosInstance';

// API Methods
export const createUser = async (userData: User) => {
    const response = await api.post('/auth/register', userData); // Note: consistent endpoint
    return response.data;
};

export const login = async (userData: UserCredentials) => {
    const response = await api.post('/auth/login', userData); // Note: consistent endpoint
    return response.data;
};

export const logout = async () => {
    const response = await api.post('/auth/logout'); // Note: consistent endpoint
    return response.data;
};