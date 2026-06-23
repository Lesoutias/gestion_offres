import type { OfferDocumentType } from "../types/offerDocument";

export const OFFER_DOCUMENT_TYPE_OPTIONS: Array<{ label: string; value: OfferDocumentType }> = [
  { label: "Offre technique", value: "offre_technique" },
  { label: "Offre financiere", value: "offre_financiere" },
  { label: "RCCM", value: "rccm" },
  { label: "Attestation fiscale", value: "attestation_fiscale" },
  { label: "Identification nationale", value: "identification_nationale" },
  { label: "Preuve d'experience", value: "preuve_experience" },
  { label: "Autre", value: "autre" },
];

export function offerDocumentTypeLabel(type: OfferDocumentType): string {
  return OFFER_DOCUMENT_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;
}
