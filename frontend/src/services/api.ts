import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { config } from '../config';
import type {
  ApiResponse,
  AuthResponse,
  SongsResponse,
  Song,
  User,
  LoginCredentials,
  RegisterData,
  SongFormData,
} from '../types';
import type { ValidationError } from '../hooks/useValidation';

const API_BASE_URL: string = config.API_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token: string | null = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Função para extrair erros de validação
export const extractValidationErrors = (error: AxiosError): ValidationError => {
  if (error.response?.status === 422 && error.response.data) {
    const data = error.response.data as any;
    if (data.errors) {
      return data.errors;
    }
  }
  return {};
};

export const authService = {
  register: (userData: RegisterData): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/register', userData),
  
  login: (credentials: LoginCredentials): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/login', credentials),
  
  logout: (): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/logout'),
  
  me: (): Promise<AxiosResponse<User>> =>
    api.get('/me'),
};

export const songService = {
  getAll: (): Promise<AxiosResponse<SongsResponse>> =>
    api.get('/songs'),
  
  getById: (id: number): Promise<AxiosResponse<Song>> =>
    api.get(`/songs/${id}`),
  
  create: (songData: SongFormData): Promise<AxiosResponse<ApiResponse<Song>>> =>
    api.post('/songs', songData),
  
  update: (id: number, songData: Partial<SongFormData>): Promise<AxiosResponse<ApiResponse<Song>>> =>
    api.put(`/songs/${id}`, songData),
  
  delete: (id: number): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/songs/${id}`),
  
  approve: (id: number): Promise<AxiosResponse<ApiResponse<Song>>> =>
    api.post(`/songs/${id}/approve`),
  
  reject: (id: number): Promise<AxiosResponse<ApiResponse<Song>>> =>
    api.post(`/songs/${id}/reject`),
  
  getPending: (): Promise<AxiosResponse<Song[]>> =>
    api.get('/songs/pending'),
};

export default api;
