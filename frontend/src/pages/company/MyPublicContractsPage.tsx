import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { contractService } from "../../services/contractService";
import type { Contract } from "../../types";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

function statusTone(status: Contract["statut"]) {
  if (status === "signed") return "green";
  if (status === "rejected") return "red";
  if (status === "pending") return "amber";
  return "blue";
}

function statusLabel(status: Contract["statut"]) {
  switch (status) {
    case "draft":
      return "Brouillon";
    case "pending":
      return "En attente de votre reponse";
    case "signed":
      return "Accepte et signe";
    case "rejected":
      return "Refuse";
    case "cancelled":
      return "Annule";
    default:
      return status;
  }
}

export default function MyPublicContractsPage() {
  const { data, loading, error, setData } = useAsyncData(() => contractService.getMine(), []);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const respond = async (contract: Contract, response: "accept" | "reject") => {
    setBusyId(contract.id);
    setActionError(null);
    setActionMessage(null);
    try {
      const updated =
        response === "accept"
          ? await contractService.accept(contract.id)
          : await contractService.reject(contract.id);
      setData((data || []).map((item) => (item.id === updated.id ? updated : item)));
      setActionMessage(response === "accept" ? "Contrat accepte. L'execution peut maintenant etre lancee." : "Contrat refuse.");
    } catch (err: any) {
      setActionError(err?.response?.data?.detail || err?.message || "Reponse impossible");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageTitle title="Mes contrats" description="Consulter les contrats envoyes et accepter ou refuser la signature." />
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
              <p className="text-sm text-slate-600">Aucun contrat recu pour le moment.</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {(data || []).map((contract) => (
                <Card key={contract.id}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-base font-semibold text-slate-950">Contrat #{contract.id}</h2>
                        <p className="text-sm text-slate-600">Reference: {contract.reference}</p>
                      </div>
                      <Badge tone={statusTone(contract.statut)}>{statusLabel(contract.statut)}</Badge>
                    </div>
                    {contract.garanties && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500">Garanties</p>
                        <p className="text-sm text-slate-700">{contract.garanties}</p>
                      </div>
                    )}
                    {contract.obligations && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500">Obligations</p>
                        <p className="text-sm text-slate-700">{contract.obligations}</p>
                      </div>
                    )}
                    {contract.contract_file_url && (
                      <a className="text-sm font-medium text-emerald-700" href={contract.contract_file_url} target="_blank" rel="noreferrer">
                        Voir le fichier du contrat
                      </a>
                    )}
                    {contract.date_signature && (
                      <p className="text-sm text-slate-600">
                        Signe le {new Date(contract.date_signature).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                    {contract.statut === "pending" && (
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" onClick={() => respond(contract, "accept")} disabled={busyId === contract.id}>
                          Accepter et signer
                        </Button>
                        <Button type="button" variant="danger" onClick={() => respond(contract, "reject")} disabled={busyId === contract.id}>
                          Refuser
                        </Button>
                      </div>
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
