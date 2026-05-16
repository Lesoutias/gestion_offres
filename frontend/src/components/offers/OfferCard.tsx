import type { Offer } from "../../types";
import { Card } from "../ui/Card";
import { OfferStatusBadge } from "./OfferStatusBadge";

export function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-900">Offre #{offer.id}</h3>
          <p className="text-sm text-slate-600">Montant: {offer.montant.toLocaleString()} USD</p>
          <p className="text-sm text-slate-600">Delai: {offer.delai_execution || "Non precise"}</p>
        </div>
        <OfferStatusBadge status={offer.statut} />
      </div>
    </Card>
  );
}
