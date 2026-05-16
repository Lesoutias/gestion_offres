import { useState } from "react";
import type { OfferDocumentType } from "../../types";
import { offerDocumentService } from "../../services/offerDocumentService";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";

export function OfferDocumentsUpload({ offerId }: { offerId: number }) {
  const [type, setType] = useState<OfferDocumentType>("offre_technique");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  return (
    <div className="grid gap-3">
      <Select
        label="Type de document"
        value={type}
        onChange={(e) => setType(e.target.value as OfferDocumentType)}
        options={[
          { label: "Offre technique", value: "offre_technique" },
          { label: "Offre financiere", value: "offre_financiere" },
          { label: "RCCM", value: "rccm" },
          { label: "Attestation fiscale", value: "attestation_fiscale" },
          { label: "Identification nationale", value: "identification_nationale" },
          { label: "Preuve d'experience", value: "preuve_experience" },
          { label: "Autre", value: "autre" },
        ]}
      />
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
      <Button
        type="button"
        onClick={async () => {
          if (!file) return;
          await offerDocumentService.upload(offerId, type, file);
          setMessage("Document envoye.");
        }}
      >
        Uploader
      </Button>
      {message && <p className="text-sm text-emerald-700">{message}</p>}
    </div>
  );
}
