export type PublicContractStatus =
  | "awarded"
  | "contract_pending"
  | "contract_rejected"
  | "signed"
  | "in_execution"
  | "completed"
  | "cancelled";

export interface PublicContract {
  id: number;
  tender_call_id: number;
  company_id: number;
  offer_id: number;
  authority_id: number;
  montant: number;
  statut: PublicContractStatus;
  date_attribution: string;
  created_at: string;
  updated_at: string;
}

export interface PublicContractCreate {
  tender_call_id: number;
  company_id: number;
  offer_id: number;
  authority_id: number;
  montant: number;
}
