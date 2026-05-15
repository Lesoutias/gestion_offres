import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import { UserRole } from "../../types";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({
  children,
}: DashboardLayoutProps): JSX.Element {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const getNavItems = (): NavItem[] => {
    if (!user) return [];

    const baseItems: Record<UserRole, NavItem[]> = {
      candidate: [
        { label: "Tableau de bord", href: "/candidate/dashboard", icon: "📊" },
        { label: "Mon profil", href: "/candidate/profile", icon: "👤" },
        { label: "Offres d'emploi", href: "/candidate/job-offers", icon: "💼" },
        {
          label: "Mes candidatures",
          href: "/candidate/my-applications",
          icon: "📝",
        },
      ],
      recruiter: [
        { label: "Tableau de bord", href: "/recruiter/dashboard", icon: "📊" },
        { label: "Entreprise", href: "/recruiter/company", icon: "🏢" },
        {
          label: "Créer une offre",
          href: "/recruiter/job-offers/new",
          icon: "➕",
        },
        { label: "Mes offres", href: "/recruiter/job-offers", icon: "📋" },
        { label: "Candidatures", href: "/recruiter/shortlisted", icon: "⭐" },
      ],
      admin: [
        { label: "Tableau de bord", href: "/admin/dashboard", icon: "📊" },
        {
          label: "Offres en attente",
          href: "/admin/pending-offers",
          icon: "⏳",
        },
        { label: "Utilisateurs", href: "/admin/users", icon: "👥" },
        { label: "Candidatures", href: "/admin/applications", icon: "📁" },
        { label: "Candidats retenus", href: "/admin/shortlisted", icon: "⭐" },
        { label: "Signalements", href: "/admin/reviews", icon: "🚩" },
        {
          label: "Rôles & Permissions",
          href: "/admin/roles-permissions",
          icon: "🔐",
        },
      ],
    };

    return baseItems[user.role_name] || [];
  };

  const navItems = getNavItems();

  const isActive = (href: string): boolean => {
    return location.pathname === href;
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 bg-blue-900 text-white">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-blue-800">
          <h1 className="text-2xl font-bold">GESTION OFFRES</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? "bg-blue-700 text-white"
                  : "text-blue-100 hover:bg-blue-800"
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-blue-800 p-4">
          <div className="mb-4">
            <p className="text-sm text-blue-200">Connecté en tant que:</p>
            <p className="font-semibold text-white truncate">
              {user?.full_name}
            </p>
            <p className="text-xs text-blue-300">
              {user?.role_name === "candidate" && "Demandeur d'emploi"}
              {user?.role_name === "recruiter" && "Recruteur"}
              {user?.role_name === "admin" && "Administrateur"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar for mobile */}
        <div className="md:hidden bg-blue-900 text-white h-16 flex items-center justify-between px-4">
          <h1 className="text-xl font-bold">GESTION OFFRES</h1>
          <div className="text-sm">
            <p className="font-semibold">{user?.full_name}</p>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
