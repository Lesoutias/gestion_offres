export interface Company {
  id: number;
  name: string;
  description?: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  industry?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
  owner_id: number;
}

export interface CompanyCreate {
  name: string;
  description?: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  industry?: string;
}

export interface CompanyUpdate {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  industry?: string;
}
