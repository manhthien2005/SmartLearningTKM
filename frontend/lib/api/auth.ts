import apiClient from './client';
import { User } from '@/store/authStore';

export interface LoginRequest {
  email: string;
  password: string;
  rememberDevice?: boolean;
  deviceToken?: string;
  selectedRole?: string;
}

export interface LoginResponse {
  message: string;
  skipOTP: boolean;
  user?: User;
  deviceToken?: string;
  rememberDevice?: boolean;
  wrongRole?: boolean;
  correctRole?: string;
  action?: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
  deviceToken?: string;
  rememberDevice?: boolean;
}

export interface VerifyEmailResponse {
  message: string;
  user: User;
}

// Auth API calls
export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', data);
    return response.data;
  },

  registerStudent: async (data: RegisterRequest) => {
    const response = await apiClient.post('/api/auth/register/student', data);
    return response.data;
  },

  registerLecturer: async (data: RegisterRequest) => {
    const response = await apiClient.post('/api/auth/register/lecturer', data);
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailRequest) => {
    const response = await apiClient.post<VerifyEmailResponse>('/api/auth/email-verification', data);
    return response.data;
  },

  resendOTP: async (email: string) => {
    const response = await apiClient.post('/api/auth/resend-otp', { email });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  },
};










