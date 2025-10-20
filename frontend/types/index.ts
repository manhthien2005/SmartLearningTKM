export interface User {
  user_id: number;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
}

export interface AuthState {
  isLogin: boolean;
  user: User | null;
  token: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberDevice?: boolean;
  deviceToken?: string;
  selectedRole?: string;
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

export interface TrustedDevice {
  device_id: number;
  device_token: string;
  device_name?: string;
  device_type?: string;
  user_agent?: string;
  ip_address?: string;
  last_used: string;
  expires_at: string;
  created_at: string;
}










