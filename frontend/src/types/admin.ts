export interface AdminStats {
  total_offers: number;
  published_offers: number;
  pending_offers: number;
  rejected_offers: number;
  closed_offers: number;
  total_applications: number;
  applications_by_status: {
    pending: number;
    reviewed: number;
    shortlisted: number;
    rejected: number;
    invited: number;
    accepted: number;
  };
  total_users: number;
  candidates_count: number;
  recruiters_count: number;
  admins_count: number;
  reports_count: number;
}

export interface PipelineOverview {
  total: number;
  published: number;
  published_percentage: number;
  pending: number;
  pending_percentage: number;
  rejected: number;
  rejected_percentage: number;
  status_indicator: string;
}

export interface CandidateProfile {
  id: number;
  user_id: number;
  phone?: string;
  address?: string;
  education_level?: string;
  domain?: string;
  skills?: string;
  experience_years?: number;
  bio?: string;
}

export interface CandidateProfileUpdate {
  phone?: string;
  address?: string;
  education_level?: string;
  domain?: string;
  skills?: string;
  experience_years?: number;
  bio?: string;
}
