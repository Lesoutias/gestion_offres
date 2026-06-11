import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

export default function ProtectedRoute() {
  const location = useLocation();
  const { token, user, loading } = useAppSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Chargement de la session...
      </div>
    );
  }

  return <Outlet />;
}
