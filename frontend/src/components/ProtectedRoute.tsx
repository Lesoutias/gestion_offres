import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode;
};

const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("user"),
  );
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
