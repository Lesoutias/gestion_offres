export interface PublicAuthority {
  id: number;
  name: string;
  description?: string | null;
  budget?: number | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface PublicAuthorityCreate {
  name: string;
  description?: string;
  budget?: number;
  address?: string;
  phone?: string;
  email?: string;
  user_id: number;
}

export type PublicAuthorityUpdate = Partial<Omit<PublicAuthorityCreate, "user_id">>;
