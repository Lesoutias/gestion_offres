import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-center px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Mairie de Goma</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-6xl">Portail de gestion des appels d'offres publics</h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-200">
          Publication des appels d'offres, soumission des entreprises, evaluation, attribution et suivi d'execution des marches publics.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/tender-calls"><Button>Voir les appels publies</Button></Link>
          <Link to="/login"><Button variant="ghost" className="text-white hover:bg-white/10">Se connecter</Button></Link>
        </div>
      </section>
    </main>
  );
}
