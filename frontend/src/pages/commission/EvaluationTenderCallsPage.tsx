import { TenderCallCard } from "../../components/tenderCalls/TenderCallCard";
import { tenderCallService } from "../../services/tenderCallService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function EvaluationTenderCallsPage() {
  const { data, loading, error } = useAsyncData(() => tenderCallService.getForEvaluation(), []);
  const tenders = data || [];
  return (
    <>
      <PageTitle title="Appels a evaluer" />
      <StateBlock loading={loading} error={error}>
        {tenders.length === 0 ? (
          <p className="text-sm text-slate-600">Aucun appel d'offres en phase d'evaluation pour le moment.</p>
        ) : (
          <div className="grid gap-4">
            {tenders.map((tender) => (
              <TenderCallCard key={tender.id} tender={tender} to={`/commission/tender-calls/${tender.id}/offers`} />
            ))}
          </div>
        )}
      </StateBlock>
    </>
  );
}
