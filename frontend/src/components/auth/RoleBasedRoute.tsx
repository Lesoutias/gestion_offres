import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import type { UserRole } from "../../types";

interface RoleBasedRouteProps {
  roles: UserRole[];
}

export default function RoleBasedRoute({ roles }: RoleBasedRouteProps) {
  const user = useAppSelector((state) => state.auth.user);
  const role = (user?.role?.name || user?.role_name) as UserRole | undefined;

  if (!role) return <Navigate to="/login" replace />;
  if (!roles.includes(role)) {
    return <div className="p-8 text-center text-slate-700">Acces refuse.</div>;
  }

  return <Outlet />;
}
