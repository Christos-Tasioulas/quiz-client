import api from './axiosInstance';
import type {User} from "../types/BasicTypes.tsx";

// API Methods
export const fetchUsers = async () => {
    const response = await api.get('/users');
    if (response.status === 204) {
        return []; // 👈 normalize empty response
    }
    return response.data;
};

export const fetchUserById = async (id: string) => {
    const response = await api.get(`/users/userById/${id}`);
    return response.data;
};

export const fetchUserByUsername = async (username: string) => {
    const response = await api.get(`/users/userByUsername/${username}`);
    return response.data;
};

export const fetchCurrentUser = async () => {
    const response = await api.get('/users/me'); // Token is automatically attached via interceptor
    return response.data;
};

export const updateUser = async (id: string | undefined, userData: Partial<User>) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
};


export const deleteUser = async (id: string | undefined) => {
    await api.delete(`/users/${id}`);
};