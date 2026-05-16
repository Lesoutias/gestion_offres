import { TenderCallCard } from "../../components/tenderCalls/TenderCallCard";
import { tenderCallService } from "../../services/tenderCallService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function CompanyPublishedTenderCallsPage() {
  const { data, loading, error } = useAsyncData(() => tenderCallService.getPublished(), []);
  return <><PageTitle title="Appels d'offres publies" /><StateBlock loading={loading} error={error}><div className="grid gap-4">{(data || []).map((tender) => <TenderCallCard key={tender.id} tender={tender} to={`/company/tender-calls/${tender.id}`} />)}</div></StateBlock></>;
}
