from pydantic import BaseModel


class AdminDashboardStats(BaseModel):
    total_users: int = 0
    total_companies: int = 0
    verified_companies: int = 0
    total_tender_calls: int = 0
    published_tender_calls: int = 0
    closed_tender_calls: int = 0
    submitted_offers: int = 0
    awarded_public_contracts: int = 0
    signed_contracts: int = 0
    projects_in_execution: int = 0
    completed_projects: int = 0
    total_awarded_amount_usd: float = 0.0
    total_awarded_amount_cdf: float = 0.0


class AuthorityDashboardStats(BaseModel):
    total_tender_calls: int = 0
    published_tender_calls: int = 0
    evaluation_tender_calls: int = 0
    awarded_tender_calls: int = 0
    submitted_offers: int = 0
    public_contracts: int = 0
    signed_contracts: int = 0
    projects_in_execution: int = 0
    completed_projects: int = 0
    total_awarded_amount_usd: float = 0.0
    total_awarded_amount_cdf: float = 0.0


class CompanyDashboardStats(BaseModel):
    submitted_offers: int = 0
    accepted_offers: int = 0
    rejected_offers: int = 0
    won_public_contracts: int = 0
    signed_contracts: int = 0
    projects_in_execution: int = 0


class DashboardStats(BaseModel):
    admin: AdminDashboardStats | None = None
    authority: AuthorityDashboardStats | None = None
    company: CompanyDashboardStats | None = None
