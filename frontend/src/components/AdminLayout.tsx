import { ReactNode } from "react";
import { Link } from "react-router-dom";

type AdminLayoutProps = {
  title: string;
  active?: "dashboard" | "offers" | "candidates";
  children: ReactNode;
};

const navItems = [
  { label: "Dashboard", path: "/dashboard", key: "dashboard" },
  { label: "Gestion des offres", path: "/admin/offres", key: "offers" },
  { label: "Candidats", path: "/admin/candidats", key: "candidates" },
];

function AdminLayout({ title, active, children }: AdminLayoutProps) {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Espace administrateur
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link key={item.key} to={item.path}>
                <button
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active === item.key
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 dark:bg-slate-100 dark:text-slate-900"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}

export default AdminLayout;
