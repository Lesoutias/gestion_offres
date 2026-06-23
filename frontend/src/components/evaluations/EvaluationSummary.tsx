import type { Offer } from "../../types";
import type { OfferDocument } from "../../types/offerDocument";
import { offerDocumentTypeLabel } from "../../utils/offerDocumentTypes";
import { Card } from "../ui/Card";

export function OfferScoresSummary({ offer }: { offer: Offer }) {
  return (
    <Card title="Scores calcules automatiquement">
      <dl className="grid gap-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-slate-500">Score technique</dt>
          <dd className="font-semibold text-slate-900">{offer.score_technique ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Score financier</dt>
          <dd className="font-semibold text-slate-900">{offer.score_financier ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Score total</dt>
          <dd className="font-semibold text-slate-900">{offer.score_total ?? "-"}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-slate-500">
        Technique = conformite documentaire DAO. Financier = classement moins-disant par devise.
      </p>
    </Card>
  );
}

export function DocumentComplianceChecklist({
  requiredTypes,
  documents,
}: {
  requiredTypes: string[];
  documents: OfferDocument[];
}) {
  const uploaded = new Set(documents.map((document) => document.document_type));
  return (
    <Card title="Conformite documentaire">
      {requiredTypes.length === 0 ? (
        <p className="text-sm text-slate-600">Aucune piece obligatoire definie dans le DAO.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {requiredTypes.map((type) => {
            const ok = uploaded.has(type as OfferDocument["document_type"]);
            return (
              <li key={type} className={ok ? "text-emerald-700" : "text-red-700"}>
                {ok ? "OK" : "Manquant"} — {offerDocumentTypeLabel(type as OfferDocument["document_type"])}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
