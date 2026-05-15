export type UserRole = "admin" | "recruiter" | "candidate";

export interface User {
  id: number;
  email: string;
  full_name: string;
  role_name: UserRole;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  role_name: UserRole;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
  role_name: UserRole;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
