import type { Currency } from "./currency";

export type OfferStatus = "draft" | "submitted" | "under_review" | "accepted" | "rejected" | "awarded";

export interface Offer {
  id: number;
  tender_call_id: number;
  company_id: number;
  submitted_by_id: number;
  montant: number;
  devise: Currency;
  delai_execution?: string | null;
  proposition_technique?: string | null;
  proposition_financiere?: string | null;
  statut: OfferStatus;
  score_technique?: number | null;
  score_financier?: number | null;
  score_commission?: number | null;
  score_total?: number | null;
  date_soumission: string;
  created_at: string;
  updated_at: string;
}

export interface OfferCreate {
  tender_call_id: number;
  company_id: number;
  montant: number;
  devise: Currency;
  delai_execution?: string;
  proposition_technique?: string;
  proposition_financiere?: string;
}

export type OfferUpdate = Partial<OfferCreate> & {
  statut?: OfferStatus;
  score_technique?: number;
  score_financier?: number;
  score_commission?: number;
  score_total?: number;
};
