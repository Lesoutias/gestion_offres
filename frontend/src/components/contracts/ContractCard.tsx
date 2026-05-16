import { useState } from "react";
import type { Contract } from "../../types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { ContractDetailsModal } from "./ContractDetailsModal";

interface ContractCardProps {
  contract: Contract;
  onUpdate?: (contract: Contract) => void;
  onSign?: (contract: Contract) => void;
}

export function ContractCard({
  contract,
  onUpdate,
  onSign,
}: ContractCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "signed":
        return "green";
      case "pending":
        return "amber";
      case "rejected":
        return "red";
      case "draft":
        return "amber";
      case "cancelled":
        return "red";
      default:
        return "blue";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "signed":
        return "Signé ✓";
      case "pending":
        return "En attente";
      case "rejected":
        return "Refusé ✕";
      case "draft":
        return "Brouillon";
      case "cancelled":
        return "Annulé";
      default:
        return status;
    }
  };

  return (
    <>
      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Contrat #{contract.id}</h3>
              <p className="text-sm text-slate-600">
                Référence: {contract.reference}
              </p>
              {contract.date_signature && (
                <p className="text-sm text-slate-600">
                  Signé le:{" "}
                  {new Date(contract.date_signature).toLocaleDateString(
                    "fr-FR",
                  )}
                </p>
              )}
            </div>
            <Badge tone={getStatusColor(contract.statut)}>
              {getStatusLabel(contract.statut)}
            </Badge>
          </div>

          {contract.garanties && (
            <div>
              <p className="text-xs font-semibold text-slate-500">Garanties:</p>
              <p className="line-clamp-2 text-sm text-slate-700">
                {contract.garanties}
              </p>
            </div>
          )}

          {contract.obligations && (
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Obligations:
              </p>
              <p className="line-clamp-2 text-sm text-slate-700">
                {contract.obligations}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
              Détails
            </Button>
            {contract.statut === "draft" && onSign && (
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  onSign(contract);
                }}
              >
                Envoyer à l'entreprise
              </Button>
            )}
            {contract.statut === "pending" && (
              <div className="text-xs text-orange-600">
                ⏳ En attente de signature de l'entreprise...
              </div>
            )}
            {contract.statut === "rejected" && (
              <div className="text-xs text-red-600">
                L'entreprise a refusé ce contrat
              </div>
            )}
          </div>
        </div>
      </Card>

      {isModalOpen && (
        <ContractDetailsModal
          contract={contract}
          onClose={() => setIsModalOpen(false)}
          onUpdate={onUpdate}
          onSign={onSign}
        />
      )}
    </>
  );
}
