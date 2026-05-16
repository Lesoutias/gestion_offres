import { TenderCallCard } from "../../components/tenderCalls/TenderCallCard";
import { tenderCallService } from "../../services/tenderCallService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function PublishedTenderCallsPage() {
  const { data, loading, error } = useAsyncData(() => tenderCallService.getPublished(), []);
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <PageTitle title="Appels d'offres publies" description="Consultez les opportunites ouvertes aux entreprises." />
      <StateBlock loading={loading} error={error}>
        <div className="grid gap-4">
          {(data || []).map((tender) => <TenderCallCard key={tender.id} tender={tender} to={`/tender-calls/${tender.id}`} />)}
        </div>
      </StateBlock>
    </main>
  );
}
