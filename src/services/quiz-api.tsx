import type {QuizRequest} from "../types/Quiz.tsx";
import api from "./axiosInstance.tsx";

export const createQuiz = async (quizData: QuizRequest) => {
    const response = await api.post('/quizzes', quizData);
    return response.data;
}

export const fetchAllQuizzes = async () => {
    const response = await api.get('/quizzes');
    return response.data;
}

export const fetchQuizById = async (id: string) => {
    const response = await api.get(`/quizzes/getQuizById/${id}`);
    return response.data;
}

export const fetchQuizByName = async (name: string) => {
    const response = await api.get(`/quizzes/getQuizByName/${name}`);
    return response.data;
}

export const updateQuiz = async (id: string | undefined, quizData: Partial<QuizRequest>) => {
    const response = await api.put(`/quizzes/${id}`, quizData);
    return response.data;
}

export const deleteQuiz = async (id: string) => {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
}

