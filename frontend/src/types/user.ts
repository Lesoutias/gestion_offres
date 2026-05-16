import type { Role, UserRole } from "./role";

export interface User {
  id: number;
  email: string;
  full_name?: string | null;
  is_active: boolean;
  role_id?: number | null;
  role_name?: UserRole | string | null;
  role?: Role | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface UserCreate {
  email: string;
  full_name?: string;
  password: string;
  role_name: UserRole;
}

export interface UserUpdate {
  full_name?: string;
  is_active?: boolean;
  role_name?: UserRole;
}
