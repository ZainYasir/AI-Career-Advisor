import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ===================== AUTH ===================== */

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
}

/* ===================== QUIZ ===================== */

export interface QuizOption {
  text: string;
  career_tag: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export interface QuizAnswer {
  question_id: number;
  answer: string;
}

export interface QuizSubmission {
  answers: QuizAnswer[];
}

/* ===================== RECOMMENDATION ===================== */

export interface Recommendation {
  career: string;
  confidence: number;
  degree_programs: string[];
  universities: string[];
  explanation: string;
}

/* ===================== API CALLS ===================== */

export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },
};

export const quizAPI = {
  getQuestions: async (): Promise<QuizQuestion[]> => {
    const response = await api.get<QuizQuestion[]>('/api/quiz/questions');
    return response.data;
  },

  submitQuiz: async (data: QuizSubmission): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      '/api/quiz/submit',
      data
    );
    return response.data;
  },
};

export const recommendationAPI = {
  getRecommendations: async (): Promise<Recommendation> => {
    const response = await api.get<Recommendation>('/api/recommendations/');
    return response.data;
  },
};

export default api;
