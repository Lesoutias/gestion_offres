import { Link } from "react-router-dom";
import type { TenderCall } from "../../types";
import { Card } from "../ui/Card";
import { TenderCallStatusBadge } from "./TenderCallStatusBadge";

export function TenderCallCard({ tender, to }: { tender: TenderCall; to: string }) {
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
        <Link className="rounded-md bg-emerald-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-emerald-800" to={to}>
          Consulter
        </Link>
      </div>
    </Card>
  );
}
