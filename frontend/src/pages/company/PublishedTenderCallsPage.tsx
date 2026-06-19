import { TenderCallCard } from "../../components/tenderCalls/TenderCallCard";
import { tenderCallService } from "../../services/tenderCallService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function CompanyPublishedTenderCallsPage() {
  const { data, loading, error } = useAsyncData(() => tenderCallService.getForCompany(), []);
  const tenders = data || [];

  return (
    <>
      <PageTitle
        title="Appels d'offres"
        description="Consultez les appels publies, en brouillon ou en phase d'evaluation."
      />
      <StateBlock loading={loading} error={error}>
        {tenders.length === 0 ? (
          <p className="text-sm text-slate-600">Aucun appel d'offres disponible pour le moment.</p>
        ) : (
          <div className="grid gap-4">
            {tenders.map((tender) => (
              <TenderCallCard key={tender.id} tender={tender} to={`/company/tender-calls/${tender.id}`} />
            ))}
          </div>
        )}
      </StateBlock>
    </>
  );
}
