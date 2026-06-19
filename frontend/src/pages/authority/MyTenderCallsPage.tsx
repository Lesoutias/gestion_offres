import { TenderCallCard } from "../../components/tenderCalls/TenderCallCard";
import { tenderCallService } from "../../services/tenderCallService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";
import { useTenderCallEvaluation } from "./useTenderCallEvaluation";

export default function MyTenderCallsPage() {
  const { data, loading, error, setData, setError } = useAsyncData(() => tenderCallService.getAll(), []);
  const startEvaluation = useTenderCallEvaluation(setData, setError);

  return (
    <>
      <PageTitle title="Mes appels d'offres" />
      <StateBlock loading={loading} error={error}>
        <div className="grid gap-4">
          {(data || []).map((tender) => (
            <TenderCallCard
              key={tender.id}
              tender={tender}
              to={`/authority/tender-calls/${tender.id}`}
              onStartEvaluation={startEvaluation}
            />
          ))}
        </div>
      </StateBlock>
    </>
  );
}
