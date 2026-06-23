import { Link } from "react-router-dom";
import { PublicShell } from "../../components/layout/PublicShell";
import { TenderCallCard } from "../../components/tenderCalls/TenderCallCard";
import { tenderCallService } from "../../services/tenderCallService";
import { isSubmissionOpen, sortPublishedTenders } from "../../utils/tenderCallUtils";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function PublishedTenderCallsPage() {
  const { data, loading, error } = useAsyncData(() => tenderCallService.getPublished(), []);
  const publishedTenders = sortPublishedTenders(data || []);

  return (
    <PublicShell>
      <main className="mx-auto max-w-6xl px-4 py-8 text-slate-900">
        <div className="rounded-lg bg-white p-6">
          <PageTitle
            title="Appels d'offres publies"
            description="Consultation publique. La soumission necessite un compte entreprise."
          />
          <StateBlock loading={loading} error={error}>
            <div className="grid gap-4">
              {publishedTenders.map((tender) => (
                <div key={tender.id}>
                  <p className="mb-1 text-xs font-semibold uppercase text-slate-500">
                    {isSubmissionOpen(tender) ? "Soumissions ouvertes" : "Date limite depassee — consultation seule"}
                  </p>
                  <TenderCallCard tender={tender} to={`/tender-calls/${tender.id}`} />
                </div>
              ))}
            </div>
          </StateBlock>
          <Link to="/" className="mt-6 inline-block text-sm font-medium text-emerald-700 hover:text-emerald-800">
            Retour a l'accueil
          </Link>
        </div>
      </main>
    </PublicShell>
  );
}
