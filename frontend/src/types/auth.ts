import type { User } from "./user";
import type { UserRole } from "./role";

export type { UserRole };

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterCompanyRequest {
  email: string;
  password: string;
  full_name?: string;
  company_name: string;
  company_description?: string;
  address?: string;
  phone?: string;
  website?: string;
  rccm_number?: string;
  tax_number?: string;
  sector?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
