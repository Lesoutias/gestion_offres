import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import type { UserRole } from "../../types";

interface RoleBasedRouteProps {
  roles: UserRole[];
}

export default function RoleBasedRoute({ roles }: RoleBasedRouteProps) {
  const { user, token, loading } = useAppSelector((state) => state.auth);
  const role = (user?.role?.name || user?.role_name) as UserRole | undefined;

  if (!user && token && loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-600">
        Chargement de la session...
      </div>
    );
  }

  if (!role) return <Navigate to="/login" replace />;
  if (!roles.includes(role)) {
    return <div className="p-8 text-center text-slate-700">Acces refuse.</div>;
  }

  return <Outlet />;
}
