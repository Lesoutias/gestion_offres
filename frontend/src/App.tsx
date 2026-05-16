import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { loadCurrentUser, logout } from "./features/auth/authSlice";
import AppRouter from "./router/AppRouter";

<<<<<<< HEAD
export default function App() {
=======
function DashboardRedirect(): JSX.Element {
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role_name) {
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "recruiter":
      return <Navigate to="/recruiter/dashboard" replace />;
    default:
      return <Navigate to="/candidate/dashboard" replace />;
  }
}

// Candidate pages
import { CandidateDashboardPage } from "./pages/candidate/CandidateDashboardPage";
import { CandidateProfilePage } from "./pages/candidate/CandidateProfilePage";
import { JobOffersPage } from "./pages/candidate/JobOffersPage";
import { JobOfferDetailsPage } from "./pages/candidate/JobOfferDetailsPage";
import { ApplyToOfferPage } from "./pages/candidate/ApplyToOfferPage";
import { MyApplicationsPage } from "./pages/candidate/MyApplicationsPage";

// Recruiter pages
import { RecruiterDashboardPage } from "./pages/recruiter/RecruiterDashboardPage";
import { CompanyProfilePage } from "./pages/recruiter/CompanyProfilePage";
import { CreateJobOfferPage } from "./pages/recruiter/CreateJobOfferPage";
import { MyJobOffersPage } from "./pages/recruiter/MyJobOffersPage";
import { OfferApplicationsPage } from "./pages/recruiter/OfferApplicationsPage";
import { ShortlistedCandidatesPage } from "./pages/recruiter/ShortlistedCandidatesPage";

// Admin pages
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { PendingJobOffersPage } from "./pages/admin/PendingJobOffersPage";
import { AllUsersPage } from "./pages/admin/AllUsersPage";
import { AllApplicationsPage } from "./pages/admin/AllApplicationsPage";
import { AdminShortlistedCandidatesPage } from "./pages/admin/ShortlistedCandidatesPage";
import { ReviewsModerationPage } from "./pages/admin/ReviewsModerationPage";
import { RolesPermissionsPage } from "./pages/admin/RolesPermissionsPage";

function App(): JSX.Element {
>>>>>>> 225b83bb86ef1ee73f1852449d2e0cf0729e6585
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(loadCurrentUser());
    }
    const onLogout = () => dispatch(logout());
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, [dispatch, token]);

<<<<<<< HEAD
  return <AppRouter />;
=======
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Candidate routes */}
        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["candidate"]}>
                <CandidateDashboardPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/profile"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["candidate"]}>
                <CandidateProfilePage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/job-offers"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["candidate"]}>
                <JobOffersPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/job-offers/:id"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["candidate"]}>
                <JobOfferDetailsPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/job-offers/:id/apply"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["candidate"]}>
                <ApplyToOfferPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/my-applications"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["candidate"]}>
                <MyApplicationsPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        {/* Recruiter routes */}
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["recruiter"]}>
                <RecruiterDashboardPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/company"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["recruiter"]}>
                <CompanyProfilePage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/job-offers/new"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["recruiter"]}>
                <CreateJobOfferPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/job-offers"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["recruiter"]}>
                <MyJobOffersPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/job-offers/:id/applications"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["recruiter"]}>
                <OfferApplicationsPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/shortlisted"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["recruiter"]}>
                <ShortlistedCandidatesPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminDashboardPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pending-offers"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["admin"]}>
                <PendingJobOffersPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AllUsersPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AllApplicationsPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/shortlisted"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminShortlistedCandidatesPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["admin"]}>
                <ReviewsModerationPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/roles-permissions"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["admin"]}>
                <RolesPermissionsPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
>>>>>>> 225b83bb86ef1ee73f1852449d2e0cf0729e6585
}
