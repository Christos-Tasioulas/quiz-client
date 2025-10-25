import api from './axiosInstance';
import type {QuestionRequest} from "../types/Question.tsx";

// API Methods
export const createQuestion = async (questionData: QuestionRequest) => {
    const response = await api.post('/questions', questionData);
    return response.data;
}

export const fetchQuestions = async () => {
    const response = await api.get('/questions');
    return response.data;
}

export const fetchQuestionById = async (id: string) => {
    const response = await api.get(`/questions/questionById/${id}`);
    return response.data;
}

export const fetchRandomQuestion = async () => {
    const response = await api.get('/questions/randomQuestion');
    return response.data;
}

export const fetchAnswersByQuestion = async (id: string | undefined) => {
    const response = await api.get(`/questions/${id}/answers`);
    return response.data
}

export const updateQuestion = async (id: string | undefined, questionData: Partial<QuestionRequest>) => {
    const response = await api.put(`/questions/${id}`, questionData);
    return response.data;
}

export const deleteQuestion = async (id: string | undefined) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
}