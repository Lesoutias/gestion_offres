import { useState } from "react";
import { ExecutionProgress } from "../../components/executions/ExecutionProgress";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { executionService } from "../../services/executionService";
import type { Execution } from "../../types";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function ExecutionsPage() {
  const { data, loading, error, setData } = useAsyncData(() => executionService.getAll(), []);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const updateExecution = (updated: Execution) => {
    setData((data || []).map((execution) => (execution.id === updated.id ? updated : execution)));
  };

  const startExecution = async (execution: Execution) => {
    setBusyId(execution.id);
    setActionError(null);
    setActionMessage(null);
    try {
      const updated = await executionService.start(execution.id);
      updateExecution(updated);
      setActionMessage("Execution lancee.");
    } catch (err: any) {
      setActionError(err?.response?.data?.detail || err?.message || "Lancement impossible");
    } finally {
      setBusyId(null);
    }
  };

  const completeExecution = async (execution: Execution) => {
    setBusyId(execution.id);
    setActionError(null);
    setActionMessage(null);
    try {
      const updated = await executionService.complete(execution.id);
      updateExecution(updated);
      setActionMessage("Execution marquee comme terminee.");
    } catch (err: any) {
      setActionError(err?.response?.data?.detail || err?.message || "Cloture impossible");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageTitle title="Executions" description="Lancer l'execution uniquement apres signature du contrat par l'entreprise." />
      <StateBlock loading={loading} error={error}>
        <div className="space-y-4">
          {actionError && (
            <Card>
              <p className="text-sm text-red-700">{actionError}</p>
            </Card>
          )}
          {actionMessage && (
            <Card>
              <p className="text-sm text-emerald-700">{actionMessage}</p>
            </Card>
          )}
          {(data || []).length === 0 ? (
            <Card>
              <p className="text-sm text-slate-600">Aucune execution disponible. Une execution sera creee apres acceptation d'un contrat.</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {(data || []).map((execution) => (
                <Card key={execution.id} title={`Execution #${execution.id}`}>
                  <ExecutionProgress execution={execution} />
                  <div className="mt-4 space-y-3">
                    <p className="text-sm text-slate-600">Marche public #{execution.public_contract_id}</p>
                    {execution.statut === "not_started" && (
                      <Button type="button" onClick={() => startExecution(execution)} disabled={busyId === execution.id}>
                        {busyId === execution.id ? "Lancement..." : "Lancer l'execution"}
                      </Button>
                    )}
                    {["in_progress", "delayed"].includes(execution.statut) && (
                      <Button type="button" variant="secondary" onClick={() => completeExecution(execution)} disabled={busyId === execution.id}>
                        Marquer terminee
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </StateBlock>
    </>
  );
}
