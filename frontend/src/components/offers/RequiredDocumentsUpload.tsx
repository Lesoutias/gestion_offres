import { useState } from "react";
import type { OfferDocumentType } from "../../types";
import { offerDocumentTypeLabel } from "../../utils/offerDocumentTypes";

export function RequiredDocumentsUpload({
  requiredTypes,
  files,
  onChange,
}: {
  requiredTypes: OfferDocumentType[];
  files: Partial<Record<OfferDocumentType, File>>;
  onChange: (files: Partial<Record<OfferDocumentType, File>>) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  if (requiredTypes.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        Aucune piece obligatoire definie dans le DAO pour cet appel d'offres.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-slate-600">
        Televersez chaque document exige par le DAO avant de soumettre votre offre.
      </p>
      {requiredTypes.map((type) => (
        <label key={type} className="block rounded-md border border-slate-200 p-3">
          <span className="mb-2 block text-sm font-medium text-slate-800">
            {offerDocumentTypeLabel(type)} <span className="text-red-600">*</span>
          </span>
          <input
            type="file"
            className="text-sm"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setError(null);
              onChange({ ...files, [type]: file });
            }}
          />
          {files[type] && (
            <p className="mt-2 text-xs text-emerald-700">Fichier selectionne: {files[type]!.name}</p>
          )}
        </label>
      ))}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}

export function hasAllRequiredFiles(
  requiredTypes: OfferDocumentType[],
  files: Partial<Record<OfferDocumentType, File>>,
): boolean {
  return requiredTypes.every((type) => Boolean(files[type]));
}
