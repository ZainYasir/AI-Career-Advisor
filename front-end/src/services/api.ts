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

// Updated submission type to include language
export interface QuizSubmissionRequest {
  answers: QuizAnswer[];
  language?: 'en' | 'ur';
}

/* ===================== RECOMMENDATION ===================== */

export interface Scholarship {
  name: string
  provider: string
  eligibility: string
  link: string
}


export interface Recommendation {
  career: string;
  confidence: number;
  degree_programs: string[];
  universities: string[];
  scholarships: Scholarship[]
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

  submitQuiz: async (data: QuizSubmissionRequest): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      '/api/quiz/submit',
      data
    );
    return response.data;
  },
};

export const recommendationAPI = {
  getRecommendations: async (language: 'en' | 'ur'): Promise<Recommendation> => {
    const response = await api.get<Recommendation>(
      `/api/recommendations?language=${language}`
    );
    return response.data;
  },
};

export default api;
