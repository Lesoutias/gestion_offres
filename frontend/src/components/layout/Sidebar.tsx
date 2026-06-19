import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import type { UserRole } from "../../types";

type NavLinkItem = { label: string; to: string };
type NavGroup = { label: string; items: NavLinkItem[] };
type NavEntry = NavLinkItem | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

function isPathActive(pathname: string, to: string): boolean {
  if (pathname === to) return true;
  if (to.endsWith("/create")) return false;
  return pathname.startsWith(`${to}/`);
}

const navByRole: Record<UserRole, NavEntry[]> = {
  admin: [
    { label: "Dashboard", to: "/admin/dashboard" },
    { label: "Utilisateurs", to: "/admin/users" },
    { label: "Roles et permissions", to: "/admin/roles-permissions" },
    { label: "Entreprises", to: "/admin/companies" },
    { label: "Autorites publiques", to: "/admin/public-authorities" },
    {
      label: "Offres",
      items: [
        { label: "Appels d'offres", to: "/admin/tender-calls" },
        { label: "Creer un appel", to: "/authority/tender-calls/create" },
      ],
    },
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
    {
      label: "Offres",
      items: [
        { label: "Appels d'offres", to: "/authority/tender-calls" },
        { label: "Creer un appel", to: "/authority/tender-calls/create" },
      ],
    },
    { label: "Contrats", to: "/authority/contracts" },
    { label: "Executions", to: "/authority/executions" },
    { label: "Audit", to: "/admin/audit-logs" },
  ],
  entreprise: [
    { label: "Dashboard", to: "/company/dashboard" },
    { label: "Profil", to: "/company/profile" },
    { label: "Appels publies", to: "/company/tender-calls" },
    { label: "Mes offres", to: "/company/offers" },
    { label: "Mes contrats", to: "/company/public-contracts" },
    { label: "Executions", to: "/company/executions" },
  ],
  commission_evaluation: [
    { label: "Dashboard", to: "/commission/dashboard" },
    { label: "Appels a evaluer", to: "/commission/tender-calls" },
  ],
};

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-md px-3 py-2 text-sm transition ${
    isActive ? "bg-emerald-600 text-white" : "text-slate-200 hover:bg-slate-800"
  }`;

const subLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-md py-2 pl-3 pr-2 text-sm transition ${
    isActive ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

function NavGroupSection({
  group,
  onNavigate,
}: {
  group: NavGroup;
  onNavigate?: () => void;
}) {
  const location = useLocation();
  const isChildActive = group.items.some((item) => isPathActive(location.pathname, item.to));
  const [open, setOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) setOpen(true);
  }, [isChildActive]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
          isChildActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800"
        }`}
        aria-expanded={open}
      >
        <span>{group.label}</span>
        <span className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
      </button>
      {open && (
        <div className="ml-3 mt-1 space-y-1 border-l border-slate-700 pl-2">
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={subLinkClass}
              onClick={onNavigate}
              end={item.to.endsWith("/create")}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

interface SidebarProps {
  mobileOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const user = useAppSelector((state) => state.auth.user);
  const role = (user?.role?.name || user?.role_name || "entreprise") as UserRole;
  const items = navByRole[role] || [];

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-slate-950 text-white transition-transform duration-200 lg:static lg:z-auto lg:min-h-screen lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div>
            <div className="text-base font-semibold">Gestion AO</div>
            <div className="text-xs text-slate-300">Institution publique</div>
          </div>
          <button
            type="button"
            aria-label="Fermer le menu"
            className="rounded-md px-2 py-1 text-slate-300 hover:bg-slate-800 lg:hidden"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
          {items.map((entry) =>
            isGroup(entry) ? (
              <NavGroupSection key={entry.label} group={entry} onNavigate={onClose} />
            ) : (
              <NavLink key={entry.to} to={entry.to} className={linkClass} onClick={onClose}>
                {entry.label}
              </NavLink>
            ),
          )}
        </nav>
      </aside>
    </>
  );
}
