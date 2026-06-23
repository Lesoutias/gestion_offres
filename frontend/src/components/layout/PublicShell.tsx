import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { Button } from "../ui/Button";

export function PublicShell({ children }: { children: ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="text-sm font-semibold text-white hover:text-emerald-300">
            Mairie de Goma — Appels d'offres
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            <Link to="/tender-calls" className="text-sm text-slate-200 hover:text-white">
              Appels publies
            </Link>
            {user ? (
              <Link to={user.role?.name === "entreprise" ? "/company/tender-calls" : "/authority/dashboard"}>
                <Button variant="secondary">Mon espace</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Se connecter
                  </Button>
                </Link>
                <Link to="/register-company">
                  <Button variant="secondary">Inscription entreprise</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
