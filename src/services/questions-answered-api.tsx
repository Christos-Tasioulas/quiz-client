import api from "./axiosInstance.tsx";
import type {QuestionAnsweredRequest} from "../types/Run.tsx";

export const fetchQuestionAnsweredById = async (id: string | undefined) => {
    const response = await api.get(`/questionsAnswered/${id}`);
    return response.data;
}

export const fetchQuestionAnsweredByRunId = async (id: string | undefined) => {
    const response = await api.get(`/questionsAnswered/questionsAnsweredByRun/${id}`);
    return response.data;
}

export const answer = async (id: string | undefined, questionData: QuestionAnsweredRequest)=> {
    const response = await api.put(`/questionsAnswered/answer/${id}`, questionData);
    return response.data;
}

export const removeAnswer = async (id: string | undefined, questionData: QuestionAnsweredRequest)=> {
    const response = await api.put(`/questionsAnswered/removeAnswer/${id}`, questionData);
    return response.data;
}