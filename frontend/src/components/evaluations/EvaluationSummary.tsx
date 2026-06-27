import { useState } from "react";
import type { Offer } from "../../types";
import type { OfferDocument } from "../../types/offerDocument";
import { offerDocumentService } from "../../services/offerDocumentService";
import { offerDocumentTypeLabel } from "../../utils/offerDocumentTypes";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

function DocumentDownloadButton({ document }: { document: OfferDocument }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="text-right">
      <Button
        type="button"
        variant="secondary"
        disabled={downloading}
        onClick={async () => {
          try {
            setDownloading(true);
            setError("");
            await offerDocumentService.download(document.id, document.file_name);
          } catch {
            setError("Telechargement impossible");
          } finally {
            setDownloading(false);
          }
        }}
      >
        {downloading ? "Telechargement..." : "Telecharger"}
      </Button>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}

export function OfferScoresSummary({ offer }: { offer: Offer }) {
  return (
    <Card title="Scores calcules automatiquement">
      <dl className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-slate-500">Score technique</dt>
          <dd className="font-semibold text-slate-900">{offer.score_technique ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Score financier</dt>
          <dd className="font-semibold text-slate-900">{offer.score_financier ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Avis commission</dt>
          <dd className="font-semibold text-slate-900">{offer.score_commission ?? "En attente"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Score total</dt>
          <dd className="font-semibold text-slate-900">{offer.score_total ?? "-"}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-slate-500">
        Total = conformite documentaire 40 % + score financier 40 % + avis de la commission 20 %.
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
  return (
    <Card title="Documents soumis par l'entreprise">
      {requiredTypes.length === 0 ? (
        <p className="text-sm text-slate-600">Aucune piece obligatoire definie dans le DAO.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {requiredTypes.map((type) => {
            const document = documents.find((item) => item.document_type === type);
            return (
              <li key={type} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 p-3">
                <div>
                  <p className={document ? "font-medium text-emerald-700" : "font-medium text-red-700"}>
                    {document ? "Fourni" : "Manquant"} — {offerDocumentTypeLabel(type)}
                  </p>
                  {document && <p className="mt-1 text-xs text-slate-500">{document.file_name}</p>}
                </div>
                {document && <DocumentDownloadButton document={document} />}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
