import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import type { UserRole } from "../../types";

type NavItem = { label: string; to: string };

const navByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { label: "Dashboard", to: "/admin/dashboard" },
    { label: "Utilisateurs", to: "/admin/users" },
    { label: "Roles et permissions", to: "/admin/roles-permissions" },
    { label: "Entreprises", to: "/admin/companies" },
    { label: "Autorites publiques", to: "/admin/public-authorities" },
    { label: "Appels d'offres", to: "/admin/tender-calls" },
    { label: "Offres recues", to: "/admin/offers" },
    { label: "Marches publics", to: "/admin/public-contracts" },
    { label: "Audit", to: "/admin/audit-logs" },
  ],
  autorite_publique: [
    { label: "Dashboard", to: "/authority/dashboard" },
    { label: "Admin global", to: "/admin/dashboard" },
    { label: "Utilisateurs", to: "/admin/users" },
    { label: "Roles et permissions", to: "/admin/roles-permissions" },
    { label: "Entreprises", to: "/admin/companies" },
    { label: "Autorites publiques", to: "/admin/public-authorities" },
    { label: "Appels d'offres", to: "/authority/tender-calls" },
    { label: "Creer un appel", to: "/authority/tender-calls/create" },
    { label: "Contrats", to: "/authority/contracts" },
    { label: "Executions", to: "/authority/executions" },
    { label: "Audit", to: "/admin/audit-logs" },
  ],
  entreprise: [
    { label: "Dashboard", to: "/company/dashboard" },
    { label: "Profil", to: "/company/profile" },
    { label: "Appels publies", to: "/company/tender-calls" },
    { label: "Mes offres", to: "/company/offers" },
    { label: "Mes marches", to: "/company/public-contracts" },
    { label: "Executions", to: "/company/executions" },
  ],
  commission_evaluation: [
    { label: "Dashboard", to: "/commission/dashboard" },
    { label: "Appels a evaluer", to: "/commission/tender-calls" },
  ],
};

export function Sidebar() {
  const user = useAppSelector((state) => state.auth.user);
  const role = (user?.role?.name || user?.role_name || "entreprise") as UserRole;
  const items = navByRole[role] || [];

  return (
    <aside className="border-r border-slate-200 bg-slate-950 text-white lg:min-h-screen lg:w-72">
      <div className="px-5 py-5">
        <div className="text-base font-semibold">Gestion AO</div>
        <div className="text-xs text-slate-300">Institution publique</div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:overflow-visible">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block whitespace-nowrap rounded-md px-3 py-2 text-sm transition ${
                isActive ? "bg-emerald-600 text-white" : "text-slate-200 hover:bg-slate-800"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
