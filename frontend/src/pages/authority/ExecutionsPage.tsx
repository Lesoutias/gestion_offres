import { ExecutionProgress } from "../../components/executions/ExecutionProgress";
import { Card } from "../../components/ui/Card";
import { executionService } from "../../services/executionService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function ExecutionsPage() {
  const { data, loading, error } = useAsyncData(() => executionService.getAll(), []);
  return <><PageTitle title="Executions" /><StateBlock loading={loading} error={error}><div className="grid gap-4">{(data || []).map((execution) => <Card key={execution.id} title={`Execution #${execution.id}`}><ExecutionProgress execution={execution} /></Card>)}</div></StateBlock></>;
}
