import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { contractService } from "../../services/contractService";
import { publicContractService } from "../../services/publicContractService";
import type { Contract, PublicContract } from "../../types";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function MyContractsPage() {
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [loadingContractId, setLoadingContractId] = useState<number | null>(
    null,
  );

  // Récupérer les contrats de l'entreprise
  const { data: myPublicContracts, loading: publicContractsLoading } =
    useAsyncData(() => publicContractService.getMine(), []);

  // Récupérer tous les contrats associés
  const {
    data: allContracts,
    loading: contractsLoading,
    setData: setAllContracts,
  } = useAsyncData(
    () =>
      Promise.all(
        (myPublicContracts || []).map((pc) =>
          contractService.getByPublicContract(pc.id).catch(() => null),
        ),
      ).then((contracts) => contracts.filter((c): c is Contract => c !== null)),
    [myPublicContracts],
  );

  const handleAcceptContract = async (contract: Contract) => {
    setLoadingContractId(contract.id);
    setActionError(null);
    setActionSuccess(null);
    try {
      const updated = await contractService.accept(contract.id);
      setAllContracts(
        (allContracts || []).map((c) => (c.id === contract.id ? updated : c)),
      );
      setActionSuccess(
        `Contrat accepté! Vous pouvez maintenant accéder à l'exécution.`,
      );
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.detail ||
        err?.message ||
        "Erreur lors de l'acceptation";
      setActionError(errorMessage);
    } finally {
      setLoadingContractId(null);
    }
  };

  const handleRejectContract = async (contract: Contract) => {
    if (!window.confirm("Êtes-vous sûr de vouloir refuser ce contrat?")) {
      return;
    }
    setLoadingContractId(contract.id);
    setActionError(null);
    setActionSuccess(null);
    try {
      const updated = await contractService.reject(contract.id);
      setAllContracts(
        (allContracts || []).map((c) => (c.id === contract.id ? updated : c)),
      );
      setActionSuccess("Contrat refusé.");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.detail || err?.message || "Erreur lors du refus";
      setActionError(errorMessage);
    } finally {
      setLoadingContractId(null);
    }
  };

  const loading = publicContractsLoading || contractsLoading;

  const pendingContracts = (allContracts || []).filter(
    (c) => c.statut === "pending",
  );
  const signedContracts = (allContracts || []).filter(
    (c) => c.statut === "signed",
  );
  const rejectedContracts = (allContracts || []).filter(
    (c) => c.statut === "rejected",
  );

  return (
    <>
      <PageTitle title="Mes contrats" />
      <StateBlock loading={loading} error={null}>
        {actionError && (
          <Card>
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {actionError}
            </div>
          </Card>
        )}
        {actionSuccess && (
          <Card>
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
              {actionSuccess}
            </div>
          </Card>
        )}

        {pendingContracts.length > 0 && (
          <Card>
            <h3 className="mb-4 font-semibold text-orange-700">
              ⏳ Contrats en attente d'acceptation ({pendingContracts.length})
            </h3>
            <div className="space-y-3">
              {pendingContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="font-medium">Contrat #{contract.id}</p>
                      <p className="text-sm text-slate-600">
                        Référence: {contract.reference}
                      </p>
                    </div>
                    <Badge tone="amber">En attente</Badge>
                  </div>

                  {contract.garanties && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-orange-700">
                        Garanties:
                      </p>
                      <p className="whitespace-pre-wrap text-sm text-slate-700">
                        {contract.garanties}
                      </p>
                    </div>
                  )}

                  {contract.obligations && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-orange-700">
                        Obligations:
                      </p>
                      <p className="whitespace-pre-wrap text-sm text-slate-700">
                        {contract.obligations}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAcceptContract(contract)}
                      disabled={loadingContractId === contract.id}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {loadingContractId === contract.id
                        ? "Acceptation..."
                        : "✓ Accepter"}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleRejectContract(contract)}
                      disabled={loadingContractId === contract.id}
                    >
                      {loadingContractId === contract.id
                        ? "Refus..."
                        : "✕ Refuser"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {signedContracts.length > 0 && (
          <Card>
            <h3 className="mb-4 font-semibold text-emerald-700">
              ✓ Contrats acceptés ({signedContracts.length})
            </h3>
            <div className="space-y-3">
              {signedContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="rounded-lg border-2 border-emerald-200 bg-emerald-50 p-4"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="font-medium">Contrat #{contract.id}</p>
                      <p className="text-sm text-slate-600">
                        Référence: {contract.reference}
                      </p>
                    </div>
                    <Badge tone="green">Signé</Badge>
                  </div>
                  {contract.date_signature && (
                    <p className="text-sm text-emerald-700">
                      Signé le{" "}
                      {new Date(contract.date_signature).toLocaleDateString(
                        "fr-FR",
                      )}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {rejectedContracts.length > 0 && (
          <Card>
            <h3 className="mb-4 font-semibold text-red-700">
              ✕ Contrats refusés ({rejectedContracts.length})
            </h3>
            <div className="space-y-3">
              {rejectedContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="rounded-lg border-2 border-red-200 bg-red-50 p-4"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="font-medium">Contrat #{contract.id}</p>
                      <p className="text-sm text-slate-600">
                        Référence: {contract.reference}
                      </p>
                    </div>
                    <Badge tone="red">Refusé</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {(allContracts || []).length === 0 && (
          <Card>
            <div className="py-8 text-center">
              <p className="text-slate-600">Aucun contrat pour le moment</p>
            </div>
          </Card>
        )}
      </StateBlock>
    </>
  );
}
