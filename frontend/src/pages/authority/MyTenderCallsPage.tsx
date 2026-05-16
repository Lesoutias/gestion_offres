import { TenderCallCard } from "../../components/tenderCalls/TenderCallCard";
import { tenderCallService } from "../../services/tenderCallService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function MyTenderCallsPage() {
  const { data, loading, error } = useAsyncData(() => tenderCallService.getAll(), []);
  return (
    <>
      <PageTitle title="Mes appels d'offres" />
      <StateBlock loading={loading} error={error}>
        <div className="grid gap-4">{(data || []).map((tender) => <TenderCallCard key={tender.id} tender={tender} to={`/authority/tender-calls/${tender.id}`} />)}</div>
      </StateBlock>
    </>
  );
}
