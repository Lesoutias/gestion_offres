import { Link } from "react-router-dom";
import type { TenderCall } from "../../types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { TenderCallStatusBadge } from "./TenderCallStatusBadge";

export function TenderCallCard({
  tender,
  to,
  onStartEvaluation,
}: {
  tender: TenderCall;
  to: string;
  onStartEvaluation?: (tenderId: number) => void | Promise<void>;
}) {
  const canStartEvaluation = tender.statut === "published" || tender.statut === "closed";
  const offersLink =
    to.includes("/authority/tender-calls/")
      ? `/authority/tender-calls/${tender.id}/offers`
      : to.includes("/commission/tender-calls/")
        ? `/commission/tender-calls/${tender.id}/offers`
        : null;
  const showOffersLink =
    offersLink &&
    offersLink !== to &&
    (tender.statut === "published" || tender.statut === "closed" || tender.statut === "evaluation");

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase text-slate-500">{tender.reference}</span>
            <TenderCallStatusBadge status={tender.statut} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">{tender.objet}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{tender.description || "Aucune description."}</p>
          <p className="mt-3 text-sm text-slate-500">Date limite: {new Date(tender.date_limite).toLocaleString()}</p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Link className="rounded-md bg-emerald-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-emerald-800" to={to}>
            Consulter
          </Link>
          {canStartEvaluation && onStartEvaluation && (
            <Button variant="secondary" onClick={() => onStartEvaluation(tender.id)}>
              Lancer Evaluation
            </Button>
          )}
          {showOffersLink && (
            <Link to={offersLink}>
              <Button variant="ghost">Offres</Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
