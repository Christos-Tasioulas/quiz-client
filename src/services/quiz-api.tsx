import type {QuizRequest, QuizRequestWithQuestions} from "../types/Quiz.tsx";
import api from "./axiosInstance.tsx";
import type {QuestionRequest} from "../types/Question.tsx";

export const createQuiz = async (quizData: QuizRequest) => {
    const response = await api.post('/quizzes', quizData);
    return response.data;
}

export const createQuizWithQuestions = async (quizData: QuizRequestWithQuestions) => {
    const response = await api.post('/quizzes/bulk', quizData);
    return response.data;
}

export const addQuestionToQuiz = async (quizId: string, questionData: QuestionRequest) => {
    const response = await api.post(`/${quizId}/questions`, questionData);
    return response.data;
}

export const fetchAllQuizzes = async () => {
    const response = await api.get('/quizzes');
    if (response.status === 204) {
        return []; // 👈 normalize empty response
    }
    return response.data;
}

export const fetchQuizById = async (id: string) => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
}

export const fetchQuizByName = async (name: string) => {
    const response = await api.get(`/quizzes/by-name/${name}`);
    return response.data;
}

export const updateQuiz = async (id: string | undefined, quizData: Partial<QuizRequest>) => {
    const response = await api.put(`/quizzes/${id}`, quizData);
    return response.data;
}

export const updateQuizWithQuestions = async (id: string, quizData: Partial<QuizRequestWithQuestions>) => {
    const response = await api.put(`/quizzes/bulk/${id}`, quizData);
    return response.data;
}

export const updateQuestionFromQuiz = async (quizId: string, questionData: QuestionRequest, questionId: string) => {
    const response = await api.put(`/${quizId}/questions/${questionId}`, questionData);
    return response.data;
}

export const deleteQuiz = async (id: string) => {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
}

export const deleteQuestionFromQuiz = async (quizId: string, questionId: string) => {
    const response = await api.delete(`/${quizId}/questions/${questionId}`);
    return response.data;
}

