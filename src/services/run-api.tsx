
// API Methods
import api from "./axiosInstance.tsx";
import type {RunRequest} from "../types/Run.tsx";

export const createRun = async (runData: RunRequest) => {
    const response = await api.post('/runs', runData);
    return response.data;
};

export const fetchAllRuns = async () => {
    const response = await api.get('/runs');
    return response.data;
};

export const fetchRunById = async (id: string | undefined) => {
    const response = await api.get(`/runs/${id}`);
    return response.data;
};

export const fetchRunsByUserId = async (id: string | undefined) => {
    const response = await api.get(`/runs/getRunsByUser/${id}`);
    return response.data;
};

export const fetchRunsByQuiz = async (id: string) => {
    const response = await api.get(`/runs/getRunsByQuiz/${id}`);
    return response.data;
}

export const updateProgress = async (id: string | undefined) => {
    const response = await api.put(`/runs/updateProgress/${id}`);
    return response.data;
};

export const calculateScore = async (id: string | undefined) => {
    const response = await api.put(`/runs/calculateScore/${id}`);
    return response.data;
};

export const deleteRun = async (id: string | undefined) => {
    const response = await api.delete(`/runs/${id}`);
    return response.data;
}