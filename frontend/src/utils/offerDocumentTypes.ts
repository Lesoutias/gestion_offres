import type { OfferDocumentType } from "../types/offerDocument";

export const OFFER_DOCUMENT_TYPE_OPTIONS: Array<{ label: string; value: OfferDocumentType }> = [
  { label: "Offre technique", value: "offre_technique" },
  { label: "Offre financiere", value: "offre_financiere" },
  { label: "Lettre de soumission", value: "lettre_soumission" },
  { label: "Autre document specifie par l'autorite", value: "autre" },
  { label: "Registre du commerce (RCCM)", value: "rccm" },
  { label: "Identification nationale", value: "identification_nationale" },
  { label: "Numero impot", value: "numero_impot" },
  { label: "Attestation de regularite fiscale", value: "attestation_fiscale" },
  { label: "Attestation CNSS", value: "attestation_cnss" },
  { label: "Attestation INPP", value: "attestation_inpp" },
  { label: "Attestation ONEM", value: "attestation_onem" },
  { label: "Statuts de l'entreprise", value: "statuts_entreprise" },
  { label: "Pouvoir du signataire", value: "pouvoir_signataire" },
  { label: "Garantie de soumission", value: "garantie_soumission" },
  { label: "Attestation bancaire", value: "attestation_bancaire" },
  { label: "Etats financiers", value: "etats_financiers" },
  { label: "References de marches similaires", value: "preuve_experience" },
  { label: "CV du personnel cle", value: "cv_personnel_cle" },
  { label: "Liste du materiel", value: "liste_materiel" },
  { label: "Calendrier d'execution", value: "calendrier_execution" },
];

export function offerDocumentTypeLabel(type: OfferDocumentType): string {
  return OFFER_DOCUMENT_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;
}
