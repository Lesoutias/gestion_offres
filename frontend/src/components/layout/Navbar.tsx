import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import { Button } from "../ui/Button";

export function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className="flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <div>
        <p className="text-sm font-semibold text-slate-900">Mairie de Goma</p>
        <p className="text-xs text-slate-500">Portail de gestion des appels d'offres publics</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-800">{user?.full_name || user?.email}</p>
          <p className="text-xs text-slate-500">{user?.role?.name || user?.role_name}</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            dispatch(logout());
            navigate("/login");
          }}
        >
          Deconnexion
        </Button>
      </div>
    </header>
  );
}
