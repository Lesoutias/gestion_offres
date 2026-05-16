import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import RoleBasedRoute from "../components/auth/RoleBasedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterCompanyPage from "../pages/auth/RegisterCompanyPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import UsersPage from "../pages/admin/UsersPage";
import RolesPermissionsPage from "../pages/admin/RolesPermissionsPage";
import CompaniesPage from "../pages/admin/CompaniesPage";
import PublicAuthoritiesPage from "../pages/admin/PublicAuthoritiesPage";
import AllTenderCallsPage from "../pages/admin/AllTenderCallsPage";
import AllOffersPage from "../pages/admin/AllOffersPage";
import PublicContractsPage from "../pages/admin/PublicContractsPage";
import AuditLogsPage from "../pages/admin/AuditLogsPage";
import AuthorityDashboardPage from "../pages/authority/AuthorityDashboardPage";
import CreateTenderCallPage from "../pages/authority/CreateTenderCallPage";
import MyTenderCallsPage from "../pages/authority/MyTenderCallsPage";
import AuthorityTenderCallDetailsPage from "../pages/authority/TenderCallDetailsPage";
import DaoDocumentPage from "../pages/authority/DaoDocumentPage";
import TenderOffersPage from "../pages/authority/TenderOffersPage";
import EvaluateOffersPage from "../pages/authority/EvaluateOffersPage";
import AwardMarketPage from "../pages/authority/AwardMarketPage";
import ContractsPage from "../pages/authority/ContractsPage";
import ExecutionsPage from "../pages/authority/ExecutionsPage";
import CompanyDashboardPage from "../pages/company/CompanyDashboardPage";
import CompanyProfilePage from "../pages/company/CompanyProfilePage";
import CompanyPublishedTenderCallsPage from "../pages/company/PublishedTenderCallsPage";
import CompanyTenderCallDetailsPage from "../pages/company/TenderCallDetailsPage";
import SubmitOfferPage from "../pages/company/SubmitOfferPage";
import MyOffersPage from "../pages/company/MyOffersPage";
import MyPublicContractsPage from "../pages/company/MyPublicContractsPage";
import MyExecutionsPage from "../pages/company/MyExecutionsPage";
import CommissionDashboardPage from "../pages/commission/CommissionDashboardPage";
import EvaluationTenderCallsPage from "../pages/commission/EvaluationTenderCallsPage";
import EvaluationOffersPage from "../pages/commission/EvaluationOffersPage";
import HomePage from "../pages/public/HomePage";
import PublishedTenderCallsPage from "../pages/public/PublishedTenderCallsPage";
import PublishedTenderCallDetailsPage from "../pages/public/PublishedTenderCallDetailsPage";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tender-calls" element={<PublishedTenderCallsPage />} />
      <Route path="/tender-calls/:id" element={<PublishedTenderCallDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-company" element={<RegisterCompanyPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route element={<RoleBasedRoute roles={["admin", "autorite_publique"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/roles-permissions" element={<RolesPermissionsPage />} />
            <Route path="/admin/companies" element={<CompaniesPage />} />
            <Route path="/admin/public-authorities" element={<PublicAuthoritiesPage />} />
            <Route path="/admin/tender-calls" element={<AllTenderCallsPage />} />
            <Route path="/admin/offers" element={<AllOffersPage />} />
            <Route path="/admin/public-contracts" element={<PublicContractsPage />} />
            <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
          </Route>

          <Route element={<RoleBasedRoute roles={["autorite_publique", "admin"]} />}>
            <Route path="/authority/dashboard" element={<AuthorityDashboardPage />} />
            <Route path="/authority/tender-calls/create" element={<CreateTenderCallPage />} />
            <Route path="/authority/tender-calls" element={<MyTenderCallsPage />} />
            <Route path="/authority/tender-calls/:id" element={<AuthorityTenderCallDetailsPage />} />
            <Route path="/authority/tender-calls/:id/dao" element={<DaoDocumentPage />} />
            <Route path="/authority/tender-calls/:id/offers" element={<TenderOffersPage />} />
            <Route path="/authority/tender-calls/:id/evaluation" element={<EvaluateOffersPage />} />
            <Route path="/authority/tender-calls/:id/award" element={<AwardMarketPage />} />
            <Route path="/authority/contracts" element={<ContractsPage />} />
            <Route path="/authority/executions" element={<ExecutionsPage />} />
          </Route>

          <Route element={<RoleBasedRoute roles={["entreprise"]} />}>
            <Route path="/company/dashboard" element={<CompanyDashboardPage />} />
            <Route path="/company/profile" element={<CompanyProfilePage />} />
            <Route path="/company/tender-calls" element={<CompanyPublishedTenderCallsPage />} />
            <Route path="/company/tender-calls/:id" element={<CompanyTenderCallDetailsPage />} />
            <Route path="/company/tender-calls/:id/submit-offer" element={<SubmitOfferPage />} />
            <Route path="/company/offers" element={<MyOffersPage />} />
            <Route path="/company/public-contracts" element={<MyPublicContractsPage />} />
            <Route path="/company/executions" element={<MyExecutionsPage />} />
          </Route>

          <Route element={<RoleBasedRoute roles={["commission_evaluation"]} />}>
            <Route path="/commission/dashboard" element={<CommissionDashboardPage />} />
            <Route path="/commission/tender-calls" element={<EvaluationTenderCallsPage />} />
            <Route path="/commission/tender-calls/:id/offers" element={<EvaluationOffersPage />} />
            <Route path="/commission/offers/:id/evaluate" element={<EvaluationOffersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
