import { api, unwrap } from "./api";
import type { AdminDashboardStats, AuthorityDashboardStats, CompanyDashboardStats } from "../types";

export const dashboardService = {
  getAdminStats: () => unwrap<AdminDashboardStats>(api.get("/dashboard/admin/stats")),
  getAuthorityStats: () => unwrap<AuthorityDashboardStats>(api.get("/dashboard/authority/stats")),
  getCompanyStats: () => unwrap<CompanyDashboardStats>(api.get("/dashboard/company/stats")),
};
