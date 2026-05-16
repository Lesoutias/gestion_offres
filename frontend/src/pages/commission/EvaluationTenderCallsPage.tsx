import { TenderCallCard } from "../../components/tenderCalls/TenderCallCard";
import { tenderCallService } from "../../services/tenderCallService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function EvaluationTenderCallsPage() {
  const { data, loading, error } = useAsyncData(() => tenderCallService.getAll(), []);
  const tenders = (data || []).filter((item) => item.statut === "evaluation" || item.statut === "closed");
  return <><PageTitle title="Appels a evaluer" /><StateBlock loading={loading} error={error}><div className="grid gap-4">{tenders.map((tender) => <TenderCallCard key={tender.id} tender={tender} to={`/commission/tender-calls/${tender.id}/offers`} />)}</div></StateBlock></>;
}
