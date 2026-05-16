import { ExecutionProgress } from "../../components/executions/ExecutionProgress";
import { Card } from "../../components/ui/Card";
import { executionService } from "../../services/executionService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function MyExecutionsPage() {
  const { data, loading, error } = useAsyncData(() => executionService.getMine(), []);

  return (
    <>
      <PageTitle title="Executions de mes marches" description="Les executions apparaissent apres acceptation du contrat." />
      <StateBlock loading={loading} error={error}>
        {(data || []).length === 0 ? (
          <Card>
            <p className="text-sm text-slate-600">Aucune execution disponible. Acceptez d'abord un contrat envoye.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(data || []).map((execution) => (
              <Card key={execution.id} title={`Execution #${execution.id}`}>
                <ExecutionProgress execution={execution} />
                <div className="mt-4 space-y-1 text-sm text-slate-600">
                  <p>Marche public #{execution.public_contract_id}</p>
                  {execution.date_debut && <p>Debut: {new Date(execution.date_debut).toLocaleDateString("fr-FR")}</p>}
                  {execution.date_fin_prevue && <p>Fin prevue: {new Date(execution.date_fin_prevue).toLocaleDateString("fr-FR")}</p>}
                  {execution.observations && <p>{execution.observations}</p>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </StateBlock>
    </>
  );
}
