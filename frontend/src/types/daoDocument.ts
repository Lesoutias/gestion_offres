import type { OfferDocumentType } from "./offerDocument";

export interface DaoDocument {
  id: number;
  tender_call_id: number;
  cahier_des_charges?: string | null;
  criteres_selection?: string | null;
  conditions_participation?: string | null;
  pieces_exigees?: string | null;
  required_document_types: OfferDocumentType[];
  document_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DaoDocumentCreate {
  tender_call_id: number;
  cahier_des_charges?: string;
  criteres_selection?: string;
  conditions_participation?: string;
  pieces_exigees?: string;
  required_document_types?: OfferDocumentType[];
  document_url?: string;
}

export type DaoDocumentUpdate = Partial<Omit<DaoDocumentCreate, "tender_call_id">>;
