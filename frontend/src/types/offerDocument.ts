export type OfferDocumentType = string;

export interface SubmissionDocumentType {
  id: number;
  code: OfferDocumentType;
  label: string;
  description?: string | null;
  display_order: number;
}

export interface OfferDocument {
  id: number;
  offer_id: number;
  document_type: OfferDocumentType;
  file_url: string;
  file_name: string;
  file_mime_type: string;
  uploaded_at: string;
}
