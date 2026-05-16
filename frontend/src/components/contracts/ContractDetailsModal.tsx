import { useState } from "react";
import type { Contract } from "../../types";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

interface ContractDetailsModalProps {
  contract: Contract;
  onClose: () => void;
  onUpdate?: (contract: Contract) => void;
  onSign?: (contract: Contract) => void;
  onAccept?: (contract: Contract) => void;
  onReject?: (contract: Contract) => void;
  isCompany?: boolean;
}

export function ContractDetailsModal({
  contract,
  onClose,
  onUpdate,
  onSign,
  onAccept,
  onReject,
  isCompany = false,
}: ContractDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    garanties: contract.garanties || "",
    obligations: contract.obligations || "",
  });

  const handleSave = async () => {
    if (!onUpdate) return;
    setIsLoading(true);
    setError(null);
    try {
      await onUpdate({ ...contract, ...formData });
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Erreur lors de la mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSign = async () => {
    if (!onSign) return;
    setIsLoading(true);
    setError(null);
    try {
      await onSign(contract);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Erreur lors de l'envoi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptClick = async () => {
    if (!onAccept) return;
    setIsLoading(true);
    setError(null);
    try {
      await onAccept(contract);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Erreur lors de l'acceptation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectClick = async () => {
    if (!onReject) return;
    if (!window.confirm("Êtes-vous sûr de vouloir refuser ce contrat?")) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await onReject(contract);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Erreur lors du refus");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={true} title={`Contrat #${contract.id}`} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-600">
            Référence: {contract.reference}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Statut</label>
            <p className="mt-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm capitalize">
              {contract.statut === "draft"
                ? "Brouillon"
                : contract.statut === "signed"
                  ? "Signé"
                  : contract.statut}
            </p>
          </div>

          {contract.date_signature && (
            <div>
              <label className="text-sm font-medium text-slate-700">
                Date de signature
              </label>
              <p className="mt-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                {new Date(contract.date_signature).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}

          {isEditing ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Garanties
                </label>
                <textarea
                  className="mt-1 min-h-24 w-full rounded-md border border-slate-300 p-3 text-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  value={formData.garanties}
                  onChange={(e) =>
                    setFormData({ ...formData, garanties: e.target.value })
                  }
                  placeholder="Détails des garanties..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Obligations
                </label>
                <textarea
                  className="mt-1 min-h-24 w-full rounded-md border border-slate-300 p-3 text-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  value={formData.obligations}
                  onChange={(e) =>
                    setFormData({ ...formData, obligations: e.target.value })
                  }
                  placeholder="Détails des obligations..."
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Garanties
                </label>
                <p className="mt-1 whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  {contract.garanties || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Obligations
                </label>
                <p className="mt-1 whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  {contract.obligations || "-"}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {!isEditing && contract.statut === "draft" && (
            <Button
              variant="secondary"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              Modifier
            </Button>
          )}
          {isEditing && (
            <>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    garanties: contract.garanties || "",
                    obligations: contract.obligations || "",
                  });
                }}
                disabled={isLoading}
              >
                Annuler
              </Button>
            </>
          )}
          {!isCompany &&
            contract.statut === "draft" &&
            onSign &&
            !isEditing && (
              <Button
                onClick={handleSign}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Envoi..." : "Envoyer à l'entreprise"}
              </Button>
            )}
          {isCompany && contract.statut === "pending" && (
            <>
              <Button
                onClick={handleAcceptClick}
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isLoading ? "Acceptation..." : "✓ Accepter"}
              </Button>
              <Button
                variant="danger"
                onClick={handleRejectClick}
                disabled={isLoading}
              >
                {isLoading ? "Refus..." : "✕ Refuser"}
              </Button>
            </>
          )}
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="ml-auto"
          >
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
