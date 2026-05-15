export type JobOfferStatus =
  | "pending"
  | "published"
  | "rejected"
  | "closed"
  | "expired";
export type ContractType = "CDI" | "CDD" | "Stage" | "Freelance";

export interface JobOffer {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  contract_type: ContractType;
  company_id: number;
  created_by_id: number;
  status: JobOfferStatus;
  published_at?: string;
  closed_at?: string;
  created_at: string;
  updated_at: string;
  domain?: string;
}

export interface JobOfferCreate {
  title: string;
  description: string;
  requirements?: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  contract_type: ContractType;
  domain?: string;
}

export interface JobOfferUpdate {
  title?: string;
  description?: string;
  requirements?: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  contract_type?: ContractType;
  domain?: string;
}

export interface JobOfferResponse {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  contract_type: ContractType;
  company: {
    id: number;
    name: string;
  };
  status: JobOfferStatus;
  created_at: string;
  updated_at: string;
  domain?: string;
}
