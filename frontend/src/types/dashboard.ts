export interface AdminDashboardStats {
  total_users: number;
  total_companies: number;
  verified_companies: number;
  total_tender_calls: number;
  published_tender_calls: number;
  closed_tender_calls: number;
  submitted_offers: number;
  awarded_public_contracts: number;
  signed_contracts: number;
  projects_in_execution: number;
  completed_projects: number;
  total_awarded_amount_usd: number;
  total_awarded_amount_cdf: number;
}

export interface AuthorityDashboardStats {
  total_tender_calls: number;
  published_tender_calls: number;
  evaluation_tender_calls: number;
  awarded_tender_calls: number;
  submitted_offers: number;
  public_contracts: number;
  signed_contracts: number;
  projects_in_execution: number;
  completed_projects: number;
  total_awarded_amount_usd: number;
  total_awarded_amount_cdf: number;
}

export interface CompanyDashboardStats {
  submitted_offers: number;
  accepted_offers: number;
  rejected_offers: number;
  won_public_contracts: number;
  signed_contracts: number;
  projects_in_execution: number;
}

export type DashboardStats = AdminDashboardStats | AuthorityDashboardStats | CompanyDashboardStats;
