export type OfferDocumentType =
  | "offre_technique"
  | "offre_financiere"
  | "rccm"
  | "attestation_fiscale"
  | "identification_nationale"
  | "preuve_experience"
  | "autre";

export interface OfferDocument {
  id: number;
  offer_id: number;
  document_type: OfferDocumentType;
  file_url: string;
  file_name: string;
  file_mime_type: string;
  uploaded_at: string;
}
