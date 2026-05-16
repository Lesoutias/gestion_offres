export interface Company {
  id: number;
  name: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  rccm_number?: string | null;
  tax_number?: string | null;
  sector?: string | null;
  is_verified: boolean;
  owner_id?: number | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyCreate {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  rccm_number?: string;
  tax_number?: string;
  sector?: string;
  owner_id?: number;
}

export type CompanyUpdate = Partial<Omit<CompanyCreate, "owner_id">>;
