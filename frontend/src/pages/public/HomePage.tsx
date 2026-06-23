import { Link } from "react-router-dom";
import { PublicShell } from "../../components/layout/PublicShell";
import { TenderCallCard } from "../../components/tenderCalls/TenderCallCard";
import { Button } from "../../components/ui/Button";
import { tenderCallService } from "../../services/tenderCallService";
import { isSubmissionOpen, sortPublishedTenders } from "../../utils/tenderCallUtils";
import { StateBlock, useAsyncData } from "../PageHelpers";

export default function HomePage() {
  const { data, loading, error } = useAsyncData(() => tenderCallService.getPublished(), []);
  const publishedTenders = sortPublishedTenders(data || []);

  return (
    <PublicShell>
      <section className="mx-auto flex min-h-[50vh] max-w-6xl flex-col justify-center px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Mairie de Goma</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-6xl">Portail de gestion des appels d'offres publics</h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-200">
          Consultez les appels publies par la mairie sans inscription. La soumission d'offre est reservee aux entreprises inscrites.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/tender-calls"><Button>Voir tous les appels publies</Button></Link>
          <Link to="/register-company"><Button variant="secondary">Inscription entreprise</Button></Link>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-900 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Appels d'offres publies</h2>
              <p className="mt-1 text-sm text-slate-300">
                Liste des appels publies par la mairie, accessibles a tous les visiteurs.
              </p>
            </div>
            <Link to="/tender-calls" className="text-sm font-medium text-emerald-300 hover:text-emerald-200">
              Voir tout
            </Link>
          </div>
          <StateBlock loading={loading} error={error}>
            {publishedTenders.length === 0 ? (
              <p className="text-sm text-slate-300">
                Aucun appel d'offres publie pour le moment. Revenez plus tard ou{" "}
                <Link to="/register-company" className="font-medium text-emerald-300">
                  inscrivez votre entreprise
                </Link>{" "}
                pour etre pret a soumettre.
              </p>
            ) : (
              <div className="grid gap-4">
                {publishedTenders.map((tender) => (
                  <div key={tender.id} className="rounded-lg bg-white text-slate-900">
                    <div className="border-b border-slate-100 px-4 py-2">
                      <span
                        className={`text-xs font-semibold uppercase ${
                          isSubmissionOpen(tender) ? "text-emerald-700" : "text-slate-500"
                        }`}
                      >
                        {isSubmissionOpen(tender) ? "Soumissions ouvertes" : "Consultation uniquement"}
                      </span>
                    </div>
                    <TenderCallCard tender={tender} to={`/tender-calls/${tender.id}`} />
                  </div>
                ))}
              </div>
            )}
          </StateBlock>
        </div>
      </section>
    </PublicShell>
  );
}
