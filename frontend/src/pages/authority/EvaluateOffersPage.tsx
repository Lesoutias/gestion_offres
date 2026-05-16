import { useParams } from "react-router-dom";
import { EvaluationTable } from "../../components/evaluations/EvaluationTable";
import { offerEvaluationService } from "../../services/offerEvaluationService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function EvaluateOffersPage() {
  const tenderCallId = Number(useParams().id);
  const { data, loading, error } = useAsyncData(() => offerEvaluationService.getByTender(tenderCallId), [tenderCallId]);
  return <><PageTitle title="Evaluations" /><StateBlock loading={loading} error={error}><EvaluationTable evaluations={data || []} /></StateBlock></>;
}
