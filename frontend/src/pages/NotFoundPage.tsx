import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-slate-950">Page introuvable</h1>
        <Link className="mt-4 inline-block text-emerald-700" to="/">Retour a l'accueil</Link>
      </div>
    </main>
  );
}
