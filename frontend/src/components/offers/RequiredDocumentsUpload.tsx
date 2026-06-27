import { useState } from "react";
import type { OfferDocumentType } from "../../types";
import { offerDocumentTypeLabel } from "../../utils/offerDocumentTypes";

const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".png", ".jpg", ".jpeg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const FILE_ACCEPT = ACCEPTED_EXTENSIONS.join(",");

function validateDocument(file: File): string | null {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    return "Format refuse. Utilisez PDF, Word, Excel, PNG ou JPG.";
  }
  if (file.size === 0) return "Le fichier est vide.";
  if (file.size > MAX_FILE_SIZE) return "Le fichier depasse la taille maximale de 5 Mo.";
  return null;
}

export function RequiredDocumentsUpload({
  requiredTypes,
  files,
  onChange,
}: {
  requiredTypes: OfferDocumentType[];
  files: Partial<Record<OfferDocumentType, File>>;
  onChange: (files: Partial<Record<OfferDocumentType, File>>) => void;
}) {
  const [errors, setErrors] = useState<Partial<Record<OfferDocumentType, string>>>({});

  if (requiredTypes.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        Aucune piece obligatoire definie dans le DAO pour cet appel d'offres.
      </p>
    );
  }

  return (
    <fieldset className="grid gap-4 rounded-md border border-slate-200 p-4">
      <legend className="px-1 text-sm font-semibold text-slate-800">Documents requis par le DAO</legend>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
        <p>Televersez un fichier pour chaque piece exigee avant la soumission.</p>
        <span className="font-medium text-emerald-700">
          {requiredTypes.filter((type) => files[type]).length}/{requiredTypes.length} fichier(s)
        </span>
      </div>
      <p className="text-xs text-slate-500">Formats acceptes : PDF, Word, Excel, PNG et JPG — 5 Mo maximum par fichier.</p>
      {requiredTypes.map((type) => (
        <label key={type} className="block rounded-md border border-slate-200 bg-slate-50 p-3">
          <span className="mb-2 block text-sm font-medium text-slate-800">
            {offerDocumentTypeLabel(type)} <span className="text-red-600">*</span>
          </span>
          <input
            type="file"
            accept={FILE_ACCEPT}
            required
            className="text-sm"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const validationError = validateDocument(file);
              if (validationError) {
                setErrors({ ...errors, [type]: validationError });
                const nextFiles = { ...files };
                delete nextFiles[type];
                onChange(nextFiles);
                event.target.value = "";
                return;
              }
              const nextErrors = { ...errors };
              delete nextErrors[type];
              setErrors(nextErrors);
              onChange({ ...files, [type]: file });
            }}
          />
          {files[type] && (
            <p className="mt-2 text-xs text-emerald-700">Fichier selectionne: {files[type]!.name}</p>
          )}
          {errors[type] && <p className="mt-2 text-xs text-red-700">{errors[type]}</p>}
        </label>
      ))}
    </fieldset>
  );
}

export function hasAllRequiredFiles(
  requiredTypes: OfferDocumentType[],
  files: Partial<Record<OfferDocumentType, File>>,
): boolean {
  return requiredTypes.every((type) => Boolean(files[type]));
}
